import React from 'react';
import { Badge, NumberInput, Select, Stack } from '@mantine/core';
import { ReceiptIcon } from '@phosphor-icons/react';
import type { ReceiptType } from '@/shared/api/types';
import { RECEIPT_TYPE_LABELS } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { FormFieldGrid, FormModal, FormModalFooter, FormSection } from '@/shared/ui';
import { useReceiptForm } from '../lib/useReceiptForm';

interface ReceiptFormModalProps {
  opened: boolean;
  onClose: () => void;
}

export const ReceiptFormModal: React.FC<ReceiptFormModalProps> = ({ opened, onClose }) => {
  const { t } = useI18n();
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
    isValid,
    isPending,
    handleSubmit,
  } = useReceiptForm(opened, onClose);

  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title={t('form.newReceipt')}
      icon={<ReceiptIcon />}
      badges={
        <Badge variant="light" color="sage" radius="sm">
          {RECEIPT_TYPE_LABELS[receiptType]}
        </Badge>
      }
      size={567}
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel={t('form.createReceipt')}
          onSubmit={handleSubmit}
          submitDisabled={!isValid}
          loading={isPending}
        />
      }
    >
      <Stack gap="sm">
          <Select
            label={t('form.receiptType')}
            data={[
              { value: 'appointment', label: t('labels.receiptType.appointment') },
              { value: 'direct sale', label: t('labels.receiptType.directSale') },
            ]}
            value={receiptType}
            onChange={(value) => setReceiptType((value as ReceiptType) ?? 'appointment')}
          />
          {receiptType === 'appointment' ? (
            <Select
              label={t('form.appointment')}
              searchable
              placeholder={t('form.enterAppointment')}
              data={appointmentOptions}
              value={appointmentId}
              onChange={setAppointmentId}
            />
          ) : (
            <Select
              label={t('form.client')}
              searchable
              clearable
              placeholder={t('form.selectClient')}
              data={clientOptions}
              value={clientId}
              onChange={setClientId}
            />
          )}
      </Stack>

      {receiptType === 'direct sale' && (
        <FormSection title={t('form.line')}>
          <FormFieldGrid cols={2}>
            <Select
              label={t('form.material')}
              searchable
              data={materialOptions}
              value={materialId}
              onChange={setMaterialId}
              nothingFoundMessage={t('form.noMaterials')}
              comboboxProps={{ withinPortal: true }}
              placeholder={
                materialOptions.length === 0
                  ? t('form.addStockFirst')
                  : t('form.selectMaterial')
              }
            />
            <NumberInput
              label={t('materials.quantity')}
              min={1}
              max={selectedMaterial?.quantity ?? undefined}
              value={materialQty}
              onChange={(value) => setMaterialQty(Number(value) || 1)}
              description={
                selectedMaterial
                  ? t('form.available', { count: selectedMaterial.quantity })
                  : undefined
              }
            />
          </FormFieldGrid>
        </FormSection>
      )}
    </FormModal>
  );
};
