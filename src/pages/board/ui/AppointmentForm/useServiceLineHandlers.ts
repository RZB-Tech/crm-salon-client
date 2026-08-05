import React from 'react';
import {
  applyServiceDuration,
  createEmptyServiceLine,
  type AppointmentFormValues,
  type LineKind,
  type MaterialOption,
  type ServiceOption,
} from '../../lib/appointmentForm';

interface UseServiceLineHandlersParams {
  values: AppointmentFormValues;
  serviceOptions: ServiceOption[];
  materialOptions: MaterialOption[];
  onChange: (values: AppointmentFormValues) => void;
}

export const useServiceLineHandlers = ({
  values,
  serviceOptions,
  materialOptions,
  onChange,
}: UseServiceLineHandlersParams) => {
  const updateLine = React.useCallback(
    (key: string, patch: Partial<(typeof values.services)[number]>) => {
      const nextServices = values.services.map((line) =>
        line.key === key ? { ...line, ...patch } : line,
      );
      onChange({ ...values, services: nextServices });
    },
    [onChange, values],
  );

  const handleKindChange = React.useCallback(
    (key: string, kind: LineKind) => {
      const nextServices = values.services.map((line) =>
        line.key === key
          ? {
              ...line,
              kind,
              serviceId: null,
              materialId: null,
              price: 0,
              catalogPrice: 0,
              priceChangedReason: '',
            }
          : line,
      );
      onChange({ ...values, services: nextServices });
    },
    [onChange, values],
  );

  const handleServiceSelect = React.useCallback(
    (key: string, serviceId: string | null) => {
      const option = serviceOptions.find((item) => item.value === serviceId);
      const nextServices = values.services.map((line) =>
        line.key === key
          ? {
              ...line,
              serviceId,
              materialId: null,
              price: option?.price ?? line.price,
              catalogPrice: option?.price ?? 0,
              priceChangedReason: '',
            }
          : line,
      );
      onChange(applyServiceDuration({ ...values, services: nextServices }, serviceOptions));
    },
    [onChange, serviceOptions, values],
  );

  const handleMaterialSelect = React.useCallback(
    (key: string, materialId: string | null) => {
      const option = materialOptions.find((item) => item.value === materialId);
      const nextServices = values.services.map((line) =>
        line.key === key
          ? {
              ...line,
              materialId,
              serviceId: null,
              price: option?.price ?? line.price,
              catalogPrice: option?.price ?? 0,
              priceChangedReason: '',
            }
          : line,
      );
      onChange({ ...values, services: nextServices });
    },
    [materialOptions, onChange, values],
  );

  const handleQuantityChange = React.useCallback(
    (key: string, quantity: number) => {
      const nextServices = values.services.map((line) =>
        line.key === key ? { ...line, quantity } : line,
      );
      onChange(applyServiceDuration({ ...values, services: nextServices }, serviceOptions));
    },
    [onChange, serviceOptions, values],
  );

  const handleRemove = React.useCallback(
    (key: string) => {
      const next = values.services.filter((line) => line.key !== key);
      const nextServices = next.length > 0 ? next : [createEmptyServiceLine()];
      onChange(applyServiceDuration({ ...values, services: nextServices }, serviceOptions));
    },
    [onChange, serviceOptions, values],
  );

  const handleAdd = React.useCallback(
    (kind: LineKind = 'service') => {
      onChange({ ...values, services: [...values.services, createEmptyServiceLine(kind)] });
    },
    [onChange, values],
  );

  return {
    updateLine,
    handleKindChange,
    handleServiceSelect,
    handleMaterialSelect,
    handleQuantityChange,
    handleRemove,
    handleAdd,
  };
};
