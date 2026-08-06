import React from 'react';
import { useAppointments } from '@/shared/api/hooks/useAppointments';
import { useClients } from '@/shared/api/hooks/useClients';
import { useMaterials } from '@/shared/api/hooks/useMaterials';
import { useCreateReceipt } from '@/shared/api/hooks/useReceipts';
import type { ReceiptType } from '@/shared/api/types';
import { formatPrice, getClientFullName } from '@/shared/lib/format';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';

export const useReceiptForm = (opened: boolean, onClose: () => void) => {
  const [receiptType, setReceiptType] = React.useState<ReceiptType>('appointment');
  const [appointmentId, setAppointmentId] = React.useState<string | null>(null);
  const [clientId, setClientId] = React.useState<string | null>(null);
  const [materialId, setMaterialId] = React.useState<string | null>(null);
  const [materialQty, setMaterialQty] = React.useState(1);

  const { data: appointments } = useAppointments();
  const { data: clients } = useClients();
  const { data: materials } = useMaterials();
  const createReceipt = useCreateReceipt();

  const resetForm = React.useCallback(() => {
    setReceiptType('appointment');
    setAppointmentId(null);
    setClientId(null);
    setMaterialId(null);
    setMaterialQty(1);
  }, []);

  useResetOnOpen(opened, resetForm);

  const appointmentOptions = React.useMemo(
    () =>
      (appointments ?? [])
        .filter((item) => !item.paid)
        .map((item) => ({
          value: String(item.id),
          label: `#${item.id} · ${item.client ? getClientFullName(item.client) : 'Клиент'} · ${formatPrice(item.total_price)}`,
        })),
    [appointments],
  );

  const clientOptions = React.useMemo(
    () => (clients ?? []).map((c) => ({ value: String(c.id), label: getClientFullName(c) })),
    [clients],
  );

  const materialOptions = React.useMemo(
    () =>
      (materials ?? [])
        .filter((material) => material.quantity > 0)
        .map((material) => ({
          value: String(material.id),
          label: `${material.name} · ${material.quantity} шт. · ${formatPrice(material.sell_price)}`,
        })),
    [materials],
  );

  const selectedMaterial = React.useMemo(
    () => (materials ?? []).find((material) => String(material.id) === materialId) ?? null,
    [materials, materialId],
  );

  const selectedAppointment = React.useMemo(
    () => (appointments ?? []).find((item) => String(item.id) === appointmentId) ?? null,
    [appointments, appointmentId],
  );

  const total =
    receiptType === 'appointment'
      ? (selectedAppointment?.total_price ?? 0)
      : (selectedMaterial?.sell_price ?? 0) * materialQty;

  const isValid =
    receiptType === 'appointment' ? Boolean(appointmentId) : Boolean(materialId) && materialQty > 0;

  const handleSubmit = React.useCallback(() => {
    if (receiptType === 'appointment') {
      createReceipt.mutate(
        { receipt_type: 'appointment', appointment_id: appointmentId ? Number(appointmentId) : null },
        { onSuccess: onClose },
      );
      return;
    }

    createReceipt.mutate(
      {
        receipt_type: 'direct sale',
        client_id: clientId ? Number(clientId) : null,
        receipt_items: materialId ? [{ material_id: Number(materialId), quantity: materialQty }] : [],
      },
      { onSuccess: onClose },
    );
  }, [receiptType, appointmentId, clientId, materialId, materialQty, createReceipt, onClose]);

  return {
    receiptType,
    setReceiptType,
    appointmentId,
    setAppointmentId,
    clientId,
    setClientId,
    materialId,
    setMaterialId,
    materialQty,
    setMaterialQty,
    appointmentOptions,
    clientOptions,
    materialOptions,
    selectedMaterial,
    total,
    isValid,
    isPending: createReceipt.isPending,
    handleSubmit,
  };
};
