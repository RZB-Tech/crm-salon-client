import React from 'react';
import { Badge, NumberInput, Select, Stack } from '@mantine/core';
import { ReceiptIcon } from '@phosphor-icons/react';
import type { ReceiptType } from '@/shared/api/types';
import { formatPrice, RECEIPT_TYPE_LABELS } from '@/shared/lib/format';
import { FormFieldGrid, FormModal, FormModalFooter, FormSection } from '@/shared/ui';
import { useReceiptForm } from '../lib/useReceiptForm';

interface ReceiptFormModalProps {
  opened: boolean;
  onClose: () => void;
}

export const ReceiptFormModal: React.FC<ReceiptFormModalProps> = ({ opened, onClose }) => {
  const {
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
    isPending,
    handleSubmit,
  } = useReceiptForm(opened, onClose);

  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title="Новый чек"
      subtitle="Продажа по записи или напрямую"
      icon={<ReceiptIcon size={22} />}
      headerAside={
        <Badge variant="light" color="sage" radius="sm">
          {RECEIPT_TYPE_LABELS[receiptType]}
        </Badge>
      }
      size="lg"
      footer={
        <FormModalFooter
          metaLabel="К оплате"
          metaValue={formatPrice(total)}
          onCancel={onClose}
          submitLabel="Создать"
          onSubmit={handleSubmit}
          submitDisabled={!isValid}
          loading={isPending}
        />
      }
    >
      <FormSection title="Чек">
        <Stack gap="sm">
          <Select
            label="Тип чека"
            data={[
              { value: 'appointment', label: 'По записи' },
              { value: 'direct sale', label: 'Прямая продажа' },
            ]}
            value={receiptType}
            onChange={(value) => setReceiptType((value as ReceiptType) ?? 'appointment')}
          />
          {receiptType === 'appointment' ? (
            <Select
              label="Запись"
              searchable
              data={appointmentOptions}
              value={appointmentId}
              onChange={setAppointmentId}
            />
          ) : (
            <Select
              label="Клиент"
              searchable
              clearable
              data={clientOptions}
              value={clientId}
              onChange={setClientId}
            />
          )}
        </Stack>
      </FormSection>

      {receiptType === 'direct sale' && (
        <FormSection title="Позиция">
          <FormFieldGrid cols={2}>
            <Select
              label="Материал"
              searchable
              data={materialOptions}
              value={materialId}
              onChange={setMaterialId}
              nothingFoundMessage="Нет материалов на складе"
              comboboxProps={{ withinPortal: true }}
              placeholder={
                materialOptions.length === 0
                  ? 'Сначала добавьте остаток на складе'
                  : 'Выберите материал'
              }
            />
            <NumberInput
              label="Количество"
              min={1}
              max={selectedMaterial?.quantity ?? undefined}
              value={materialQty}
              onChange={(value) => setMaterialQty(Number(value) || 1)}
              description={selectedMaterial ? `Доступно: ${selectedMaterial.quantity} шт.` : undefined}
            />
          </FormFieldGrid>
        </FormSection>
      )}
    </FormModal>
  );
};
