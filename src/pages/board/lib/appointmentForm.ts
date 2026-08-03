import type {
  Appointment,
  AppointmentCreatePayload,
  AppointmentServiceInput,
  AppointmentStatus,
  Employee,
  Material,
  Service,
} from '@/shared/api/types';
import {
  parseApiDateFromDateTime,
  parseApiTimeFromDateTime,
  toDateInput,
} from '@/shared/lib/format';
import { addMinutesToTime } from './appointmentBoard';

export type LineKind = 'service' | 'material';

export interface AppointmentServiceLine {
  key: string;
  id?: number;
  kind: LineKind;
  serviceId: string | null;
  materialId: string | null;
  quantity: number;
  price: number;
  catalogPrice: number;
  priceChangedReason: string;
  notes: string;
}

export interface AppointmentFormValues {
  clientId: string | null;
  employeeId: string | null;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  services: AppointmentServiceLine[];
  notes: string;
}

export interface ServiceOption {
  value: string;
  label: string;
  price: number;
  estimatedTime: number;
}

export interface MaterialOption {
  value: string;
  label: string;
  price: number;
}

export const createEmptyServiceLine = (kind: LineKind = 'service'): AppointmentServiceLine => ({
  key: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  kind,
  serviceId: null,
  materialId: null,
  quantity: 1,
  price: 0,
  catalogPrice: 0,
  priceChangedReason: '',
  notes: '',
});

export const emptyAppointmentForm = (date: Date = new Date()): AppointmentFormValues => ({
  clientId: null,
  employeeId: null,
  date: toDateInput(date),
  startTime: '10:00',
  endTime: '11:00',
  status: 'awaiting',
  services: [createEmptyServiceLine()],
  notes: '',
});

export const buildServiceOptions = (
  catalog: Service[],
  employee: Employee | undefined,
): ServiceOption[] => {
  if (!employee) return [];
  const serviceMap = new Map(catalog.map((service) => [service.id, service]));
  return (employee.services ?? []).map((service) => {
    const full = serviceMap.get(service.id);
    return {
      value: String(service.id),
      label: service.name,
      price: full?.price ?? 0,
      estimatedTime: full?.estimated_time ?? 0,
    };
  });
};

export const buildMaterialOptions = (materials: Material[]): MaterialOption[] =>
  materials.map((material) => ({
    value: String(material.id),
    label: material.name,
    price: material.sell_price,
  }));

export const calcServicesTotal = (lines: AppointmentServiceLine[]): number =>
  lines.reduce((sum, line) => sum + line.quantity * line.price, 0);

export const isLineFilled = (line: AppointmentServiceLine): boolean =>
  line.kind === 'service' ? Boolean(line.serviceId) : Boolean(line.materialId);

export const isPriceChanged = (line: AppointmentServiceLine): boolean =>
  isLineFilled(line) && line.price !== line.catalogPrice;

export const appointmentToFormValues = (
  appointment: Appointment,
  recordEmployeeId: number,
  serviceCatalog: Service[] = [],
  materials: Material[] = [],
): AppointmentFormValues => {
  const record =
    appointment.records?.find((item) => item.employee_id === recordEmployeeId) ??
    appointment.records?.[0];

  const servicePriceMap = new Map(serviceCatalog.map((s) => [s.id, s.price]));
  const materialPriceMap = new Map(materials.map((m) => [m.id, m.sell_price]));

  const services =
    record?.services.map((item, index) => {
      const isMaterial = item.material_id != null;
      const catalogPrice = isMaterial
        ? (materialPriceMap.get(item.material_id!) ?? item.price)
        : (servicePriceMap.get(item.service_id ?? 0) ?? item.price);

      return {
        key: String(item.id ?? index),
        id: item.id,
        kind: (isMaterial ? 'material' : 'service') as LineKind,
        serviceId: item.service_id != null ? String(item.service_id) : null,
        materialId: item.material_id != null ? String(item.material_id) : null,
        quantity: item.quantity,
        price: item.price,
        catalogPrice,
        priceChangedReason: item.price_changed_reason ?? '',
        notes: item.notes ?? '',
      };
    }) ?? [];

  return {
    clientId: String(appointment.client_id ?? appointment.client?.id ?? ''),
    employeeId: record ? String(record.employee_id) : null,
    date: parseApiDateFromDateTime(appointment.start_time_est),
    startTime: parseApiTimeFromDateTime(appointment.start_time_est),
    endTime: parseApiTimeFromDateTime(appointment.end_time_est),
    status: appointment.status === 'cancelled' ? 'cancelled' : appointment.status,
    services: services.length > 0 ? services : [createEmptyServiceLine()],
    notes: appointment.notes ?? '',
  };
};

/** Текст поля «Заметка» в строке услуги → всегда price_changed_reason */
export const getLineReason = (line: AppointmentServiceLine): string =>
  line.priceChangedReason.trim();

const lineToServiceInput = (line: AppointmentServiceLine): AppointmentServiceInput => {
  const reason = getLineReason(line) || null;

  if (line.kind === 'material') {
    return {
      material_id: Number(line.materialId),
      quantity: line.quantity,
      price: line.price,
      price_changed_reason: reason,
      notes: null,
    };
  }

  return {
    service_id: Number(line.serviceId),
    quantity: line.quantity,
    price: line.price,
    price_changed_reason: reason,
    notes: null,
  };
};

export const formValuesToPayload = (values: AppointmentFormValues): AppointmentCreatePayload => {
  const serviceLines = values.services.filter(isLineFilled);

  return {
    client_id: Number(values.clientId),
    start_time_est: `${values.date}T${values.startTime}:00`,
    end_time_est: `${values.date}T${values.endTime}:00`,
    notes: values.notes || null,
    records: [
      {
        employee_id: Number(values.employeeId),
        services: serviceLines.map(lineToServiceInput),
      },
    ],
  };
};

export const formLinesToCreatePayloads = (
  recordId: number,
  lines: AppointmentServiceLine[],
) =>
  lines.filter(isLineFilled).map((line) => {
    const input = lineToServiceInput(line);
    return {
      appointment_record_id: recordId,
      ...input,
      price: input.price ?? line.price,
    };
  });

export const applyStartTimeChange = (
  values: AppointmentFormValues,
  startTime: string,
  totalEstimatedTime?: number,
): AppointmentFormValues => {
  const duration = totalEstimatedTime && totalEstimatedTime > 0 ? totalEstimatedTime : 60;
  return {
    ...values,
    startTime,
    endTime: addMinutesToTime(startTime, duration),
  };
};

export const calcTotalEstimatedTime = (
  lines: AppointmentServiceLine[],
  serviceOptions: ServiceOption[],
): number => {
  const optionMap = new Map(serviceOptions.map((opt) => [opt.value, opt]));
  let total = 0;
  for (const line of lines) {
    if (line.kind !== 'service' || !line.serviceId) continue;
    const opt = optionMap.get(line.serviceId);
    if (opt && opt.estimatedTime > 0) {
      total += opt.estimatedTime * line.quantity;
    }
  }
  return total;
};

export const applyServiceDuration = (
  values: AppointmentFormValues,
  serviceOptions: ServiceOption[],
): AppointmentFormValues => {
  const totalTime = calcTotalEstimatedTime(values.services, serviceOptions);
  if (totalTime <= 0) return values;
  return {
    ...values,
    endTime: addMinutesToTime(values.startTime, totalTime),
  };
};

export const isAppointmentFormValid = (values: AppointmentFormValues): boolean => {
  if (
    !values.clientId ||
    !values.employeeId ||
    !values.date ||
    values.startTime >= values.endTime ||
    !values.services.some(isLineFilled)
  ) {
    return false;
  }

  return values.services.every((line) => {
    if (!isLineFilled(line)) return true;
    // BUG-013: Проверка на отрицательные значения
    if (line.price <= 0 || line.quantity <= 0) return false;
    if (isPriceChanged(line) && getLineReason(line).length < 5) return false;
    return true;
  });
};

export const hasScheduleChanged = (
  appointment: Appointment,
  values: AppointmentFormValues,
): boolean => {
  const clientId = appointment.client_id ?? appointment.client?.id;
  const start = `${values.date}T${values.startTime}:00`;
  const end = `${values.date}T${values.endTime}:00`;
  const apiStart = appointment.start_time_est.replace('Z', '').slice(0, 19);
  const apiEnd = appointment.end_time_est.replace('Z', '').slice(0, 19);

  return Number(values.clientId) !== clientId || start !== apiStart || end !== apiEnd;
};
