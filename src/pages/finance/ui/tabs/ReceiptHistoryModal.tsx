import React from 'react';
import { Badge } from '@mantine/core';
import { ClockCounterClockwiseIcon } from '@phosphor-icons/react';
import type { Receipt } from '@/shared/api/types';
import { formatPrice, RECEIPT_STATUS_LABELS } from '@/shared/lib/format';
import { AuditLogsPanel, FormModal, FormModalFooter, FormSection } from '@/shared/ui';

interface ReceiptHistoryModalProps {
  receipt: Receipt | null;
  onClose: () => void;
}

export const ReceiptHistoryModal: React.FC<ReceiptHistoryModalProps> = ({ receipt, onClose }) => (
  <FormModal
    opened={Boolean(receipt)}
    onClose={onClose}
    title={receipt ? `История чека #${receipt.id}` : 'История чека'}
    subtitle="Аудит изменений чека и его позиций"
    icon={<ClockCounterClockwiseIcon size={22} />}
    headerAside={
      receipt ? (
        <Badge variant="light" color={receipt.status === 'paid' ? 'teal' : 'orange'} radius="sm">
          {RECEIPT_STATUS_LABELS[receipt.status] ?? receipt.status}
        </Badge>
      ) : undefined
    }
    size="lg"
    footer={
      <FormModalFooter
        metaLabel={receipt ? 'Сумма чека' : undefined}
        metaValue={receipt ? formatPrice(receipt.total_amount) : undefined}
        cancelLabel="Закрыть"
        onCancel={onClose}
      />
    }
  >
    {receipt && (
      <>
        <FormSection title="История изменений" muted>
          <AuditLogsPanel tableName="receipts" recordId={receipt.id} />
        </FormSection>
        {receipt.items.map((item) => (
          <FormSection key={item.id} title={`Позиция #${item.id}`} muted>
            <AuditLogsPanel tableName="receipt_items" recordId={item.id} />
          </FormSection>
        ))}
      </>
    )}
  </FormModal>
);
