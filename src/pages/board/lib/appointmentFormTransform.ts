import type {
  AppointmentCreatePayload,
  AppointmentServiceInput,
} from '@/shared/api/types';
import { addMinutesToTime } from './appointmentBoard';
import type {
  AppointmentFormValues,
  AppointmentServiceLine,
  ServiceOption,
} from './appointmentFormTypes';
import { getLineReason, isLineFilled } from './appointmentFormLineUtils';

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
