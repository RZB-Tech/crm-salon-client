import React from 'react';
import { Modal, Text } from '@mantine/core';
import type { Receipt } from '@/shared/api/types';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';

interface ReceiptHistoryModalProps {
  receipt: Receipt | null;
  onClose: () => void;
}

export const ReceiptHistoryModal: React.FC<ReceiptHistoryModalProps> = ({ receipt, onClose }) => (
  <Modal
    opened={Boolean(receipt)}
    onClose={onClose}
    title={receipt ? `История чека #${receipt.id}` : 'История чека'}
    radius="md"
    size="lg"
  >
    {receipt && (
      <>
        <Text size="sm" fw={600} mb="xs">
          Чек
        </Text>
        <AuditLogsPanel tableName="receipts" recordId={receipt.id} />
        {receipt.items.map((item) => (
          <React.Fragment key={item.id}>
            <Text size="sm" fw={600} mt="md" mb="xs">
              Позиция #{item.id}
            </Text>
            <AuditLogsPanel tableName="receipt_items" recordId={item.id} />
          </React.Fragment>
        ))}
      </>
    )}
  </Modal>
);
