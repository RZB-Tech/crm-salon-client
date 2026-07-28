import React from 'react';
import { Button, Group, Modal, NumberInput, Select } from '@mantine/core';
import { useAppointments } from '@/shared/api/hooks/useAppointments';
import { useClients } from '@/shared/api/hooks/useClients';
import { useMaterials } from '@/shared/api/hooks/useMaterials';
import { useCreateReceipt } from '@/shared/api/hooks/useReceipts';
import type { ReceiptType } from '@/shared/api/types';
import { formatPrice, getClientFullName } from '@/shared/lib/format';

interface ReceiptFormModalProps {
  opened: boolean;
  onClose: () => void;
}

export const ReceiptFormModal: React.FC<ReceiptFormModalProps> = ({ opened, onClose }) => {
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

  React.useEffect(() => {
    if (opened) resetForm();
  }, [opened, resetForm]);

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

  return (
    <Modal opened={opened} onClose={onClose} title="Новый чек" radius="md" size="md">
      <Select
        label="Тип чека"
        mb="md"
        data={[
          { value: 'appointment', label: 'По записи' },
          { value: 'direct sale', label: 'Прямая продажа' },
        ]}
        value={receiptType}
        onChange={(value) => setReceiptType((value as ReceiptType) ?? 'appointment')}
      />
      {receiptType === 'appointment' ? (
        <Select label="Запись" searchable mb="lg" data={appointmentOptions} value={appointmentId} onChange={setAppointmentId} />
      ) : (
        <>
          <Select label="Клиент" searchable clearable mb="md" data={clientOptions} value={clientId} onChange={setClientId} />
          <Select
            label="Материал"
            searchable
            mb="md"
            data={materialOptions}
            value={materialId}
            onChange={setMaterialId}
            nothingFoundMessage="Нет материалов на складе"
            comboboxProps={{ withinPortal: true }}
            placeholder={materialOptions.length === 0 ? 'Сначала добавьте остаток на складе' : 'Выберите материал'}
          />
          <NumberInput
            label="Количество"
            min={1}
            max={selectedMaterial?.quantity ?? undefined}
            mb="lg"
            value={materialQty}
            onChange={(value) => setMaterialQty(Number(value) || 1)}
            description={selectedMaterial ? `Доступно: ${selectedMaterial.quantity} шт.` : undefined}
          />
        </>
      )}
      <Group justify="flex-end">
        <Button variant="subtle" color="gray" onClick={onClose}>
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          loading={createReceipt.isPending}
          disabled={receiptType === 'appointment' ? !appointmentId : !materialId || materialQty <= 0}
        >
          Создать
        </Button>
      </Group>
    </Modal>
  );
};
