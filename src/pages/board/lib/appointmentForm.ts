import type {
  Appointment,
  AppointmentCreatePayload,
  Employee,
  Service,
} from '@/shared/api/types';
import { toDateInput } from '@/shared/lib/format';
import { addMinutesToTime, padTime } from './appointmentBoard';

export interface AppointmentServiceLine {
  key: string;
  serviceId: string | null;
  quantity: number;
  price: number;
}

export interface AppointmentFormValues {
  clientId: string | null;
  employeeId: string | null;
  date: string;
  startTime: string;
  endTime: string;
  services: AppointmentServiceLine[];
  notes: string;
}

export interface ServiceOption {
  value: string;
  label: string;
  price: number;
}

export const createEmptyServiceLine = (): AppointmentServiceLine => ({
  key: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  serviceId: null,
  quantity: 1,
  price: 0,
});

export const emptyAppointmentForm = (date: Date = new Date()): AppointmentFormValues => ({
  clientId: null,
  employeeId: null,
  date: toDateInput(date),
  startTime: '10:00',
  endTime: '11:00',
  services: [createEmptyServiceLine()],
  notes: '',
});

export const buildServiceOptions = (
  catalog: Service[],
  employee: Employee | undefined,
): ServiceOption[] => {
  if (!employee) return [];
  const priceMap = new Map(catalog.map((service) => [service.id, service.price]));
  return (employee.services ?? []).map((service) => ({
    value: String(service.id),
    label: service.name,
    price: priceMap.get(service.id) ?? 0,
  }));
};

export const calcServicesTotal = (lines: AppointmentServiceLine[]): number =>
  lines.reduce((sum, line) => sum + line.quantity * line.price, 0);

export const appointmentToFormValues = (
  appointment: Appointment,
  recordEmployeeId: number,
): AppointmentFormValues => {
  const start = new Date(appointment.start_time_est);
  const end = new Date(appointment.end_time_est);
  const record =
    appointment.records?.find((item) => item.employee_id === recordEmployeeId) ??
    appointment.records?.[0];

  const services =
    record?.services.map((item, index) => ({
      key: String(item.id ?? index),
      serviceId: item.service_id != null ? String(item.service_id) : null,
      quantity: item.quantity,
      price: item.price,
    })) ?? [];

  return {
    clientId: String(appointment.client_id),
    employeeId: record ? String(record.employee_id) : null,
    date: toDateInput(start),
    startTime: `${padTime(start.getHours())}:${padTime(start.getMinutes())}`,
    endTime: `${padTime(end.getHours())}:${padTime(end.getMinutes())}`,
    services: services.length > 0 ? services : [createEmptyServiceLine()],
    notes: appointment.notes ?? '',
  };
};

export const formValuesToPayload = (values: AppointmentFormValues): AppointmentCreatePayload => {
  const serviceLines = values.services.filter((line) => line.serviceId);

  return {
    client_id: Number(values.clientId),
    start_time_est: `${values.date}T${values.startTime}:00`,
    end_time_est: `${values.date}T${values.endTime}:00`,
    notes: values.notes || null,
    records: [
      {
        employee_id: Number(values.employeeId),
        services: serviceLines.map((line) => ({
          service_id: Number(line.serviceId),
          quantity: line.quantity,
          price: line.price,
        })),
      },
    ],
  };
};

export const applyStartTimeChange = (
  values: AppointmentFormValues,
  startTime: string,
): AppointmentFormValues => ({
  ...values,
  startTime,
  endTime: addMinutesToTime(startTime, 60),
});

export const isAppointmentFormValid = (values: AppointmentFormValues): boolean =>
  Boolean(values.clientId) &&
  Boolean(values.employeeId) &&
  Boolean(values.date) &&
  values.services.some((line) => line.serviceId) &&
  values.startTime < values.endTime;
