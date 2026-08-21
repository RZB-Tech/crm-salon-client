import React from 'react';
import { Badge, NumberInput, Select, Stack } from '@mantine/core';
import { CurrencyCircleDollarIcon } from '@phosphor-icons/react';
import { useUpdateClientDeposit } from '@/shared/api/hooks/useClients';
import type { Client } from '@/shared/api/types';
import { formatPrice } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { FormModal, FormModalFooter, FormSection } from '@/shared/ui';

interface DepositModalProps {
  client: Client | null;
  onClose: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ client, onClose }) => {
  const { t } = useI18n();
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
  const operationOptions = [
    { value: '1', label: t('clients.topUp') },
    { value: '-1', label: t('clients.writeOff') },
  ];

  return (
    <FormModal
      opened={Boolean(client)}
      onClose={onClose}
      title={t('clients.depositChange')}
      icon={<CurrencyCircleDollarIcon />}
      headerAside={
        client ? (
          <Badge variant='light' color='sage' size='lg' radius='sm'>
            {formatPrice(client.deposit)}
          </Badge>
        ) : undefined
      }
      size={567}
      footer={
        <FormModalFooter
          metaLabel={t('clients.afterBalance')}
          metaValue={formatPrice(nextBalance)}
          onCancel={onClose}
          submitLabel={t('common.apply')}
          onSubmit={handleSubmit}
          submitDisabled={amount <= 0}
          loading={updateDeposit.isPending}
        />
      }
    >
      <FormSection title={t('clients.operation')}>
        <Stack gap='sm'>
          <Select
            label={t('form.operationType')}
            data={operationOptions}
            value={operation}
            onChange={(v) => setOperation((v as '1' | '-1') ?? '1')}
          />
          <NumberInput
            label={t('form.amount')}
            required
            min={1}
            value={amount}
            onChange={(v) => setAmount(Number(v) || 0)}
            thousandSeparator=' '
            suffix={` ${t('common.currency')}`}
          />
        </Stack>
      </FormSection>
    </FormModal>
  );
};
