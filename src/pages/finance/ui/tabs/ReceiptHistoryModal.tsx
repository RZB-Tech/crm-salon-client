import React from 'react';
import { Badge } from '@mantine/core';
import { ClockCounterClockwiseIcon } from '@phosphor-icons/react';
import type { Receipt } from '@/shared/api/types';
import { formatPrice, RECEIPT_STATUS_LABELS } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { AuditLogsPanel, FormModal, FormModalFooter, FormSection } from '@/shared/ui';

interface ReceiptHistoryModalProps {
  receipt: Receipt | null;
  onClose: () => void;
}

export const ReceiptHistoryModal: React.FC<ReceiptHistoryModalProps> = ({ receipt, onClose }) => {
  const { t } = useI18n();
  return (
    <FormModal
      opened={Boolean(receipt)}
      onClose={onClose}
      title={receipt ? t('form.receiptHistoryNamed', { id: receipt.id }) : t('form.receiptHistory')}
      subtitle={t('form.receiptAudit')}
      icon={<ClockCounterClockwiseIcon size={22} />}
      headerAside={
        receipt ? (
          <Badge variant="light" color={receipt.status === 'paid' ? 'teal' : 'orange'} radius="sm">
            {RECEIPT_STATUS_LABELS[receipt.status] ?? receipt.status}
          </Badge>
        ) : undefined
      }
      size={567}
      footer={
        <FormModalFooter
          metaLabel={receipt ? t('form.receiptAmount') : undefined}
          metaValue={receipt ? formatPrice(receipt.total_amount) : undefined}
          cancelLabel={t('common.close')}
          onCancel={onClose}
        />
      }
    >
      {receipt && (
        <>
          <FormSection title={t('form.changeHistory')} muted>
            <AuditLogsPanel tableName="receipts" recordId={receipt.id} />
          </FormSection>
          {receipt.items.map((item) => (
            <FormSection key={item.id} title={t('form.lineNamed', { id: item.id })} muted>
              <AuditLogsPanel tableName="receipt_items" recordId={item.id} />
            </FormSection>
          ))}
        </>
      )}
    </FormModal>
  );
};
