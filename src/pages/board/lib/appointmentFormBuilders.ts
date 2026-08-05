import type { Appointment, Employee, Material, Service } from '@/shared/api/types';
import {
  parseApiDateFromDateTime,
  parseApiTimeFromDateTime,
  toDateInput,
} from '@/shared/lib/format';
import type {
  AppointmentFormValues,
  LineKind,
  MaterialOption,
  ServiceOption,
} from './appointmentFormTypes';
import { createEmptyServiceLine } from './appointmentFormLineUtils';

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
