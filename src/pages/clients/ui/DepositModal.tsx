import React from 'react';
import { Button, Group, Modal, NumberInput, Select } from '@mantine/core';
import { useUpdateClientDeposit } from '@/shared/api/hooks/useClients';
import type { Client } from '@/shared/api/types';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';

interface DepositModalProps {
  client: Client | null;
  onClose: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ client, onClose }) => {
  const [amount, setAmount] = React.useState(0);
  const [operation, setOperation] = React.useState<'1' | '-1'>('1');
  const updateDeposit = useUpdateClientDeposit();

  useResetOnOpen(client, () => {
    setAmount(0);
    setOperation('1');
  });

  const handleSubmit = React.useCallback(() => {
    if (!client || amount <= 0) return;
    updateDeposit.mutate({ id: client.id, operation: Number(operation) as 1 | -1, amount }, { onSuccess: onClose });
  }, [client, amount, operation, updateDeposit, onClose]);

  return (
    <Modal opened={Boolean(client)} onClose={onClose} title="Изменить депозит" radius="md">
      <Select label="Операция" mb="md" data={[{ value: '1', label: 'Пополнить' }, { value: '-1', label: 'Списать' }]} value={operation} onChange={(v) => setOperation((v as '1' | '-1') ?? '1')} />
      <NumberInput label="Сумма" required min={1} mb="lg" value={amount} onChange={(v) => setAmount(Number(v) || 0)} />
      <Group justify="flex-end">
        <Button variant="subtle" color="gray" onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} loading={updateDeposit.isPending} disabled={amount <= 0}>Применить</Button>
      </Group>
    </Modal>
  );
};
