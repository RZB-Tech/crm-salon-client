import React from 'react';
import { Badge, NumberInput, Select, Stack } from '@mantine/core';
import { CurrencyCircleDollarIcon } from '@phosphor-icons/react';
import { useUpdateClientDeposit } from '@/shared/api/hooks/useClients';
import type { Client } from '@/shared/api/types';
import { formatPrice, getClientFullName } from '@/shared/lib/format';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { FormModal, FormModalFooter, FormSection } from '@/shared/ui';

const OPERATION_OPTIONS = [
  { value: '1', label: 'Пополнить' },
  { value: '-1', label: 'Списать' }
];

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
    updateDeposit.mutate(
      { id: client.id, operation: Number(operation) as 1 | -1, amount },
      { onSuccess: onClose }
    );
  }, [client, amount, operation, updateDeposit, onClose]);

  const nextBalance = (client?.deposit ?? 0) + Number(operation) * amount;

  return (
    <FormModal
      opened={Boolean(client)}
      onClose={onClose}
      title='Изменить депозит'
      subtitle={client ? getClientFullName(client) : undefined}
      icon={<CurrencyCircleDollarIcon size={22} />}
      headerAside={
        client ? (
          <Badge variant='light' color='sage' size='lg' radius='sm'>
            {formatPrice(client.deposit)}
          </Badge>
        ) : undefined
      }
      size='md'
      footer={
        <FormModalFooter
          metaLabel='Баланс после операции'
          metaValue={formatPrice(nextBalance)}
          onCancel={onClose}
          submitLabel='Применить'
          onSubmit={handleSubmit}
          submitDisabled={amount <= 0}
          loading={updateDeposit.isPending}
        />
      }
    >
      <FormSection title='Операция'>
        <Stack gap='sm'>
          <Select
            label='Тип операции'
            data={OPERATION_OPTIONS}
            value={operation}
            onChange={(v) => setOperation((v as '1' | '-1') ?? '1')}
          />
          <NumberInput
            label='Сумма'
            required
            min={1}
            value={amount}
            onChange={(v) => setAmount(Number(v) || 0)}
            thousandSeparator=' '
            suffix=' сум'
          />
        </Stack>
      </FormSection>
    </FormModal>
  );
};
