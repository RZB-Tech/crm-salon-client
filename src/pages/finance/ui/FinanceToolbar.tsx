import React from 'react';
import { Button, Group } from '@mantine/core';
import { PlusIcon } from '@phosphor-icons/react';
import { ListPageTitle, ListTabs, listPageStyles } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';

interface FinanceToolbarProps {
  tab: string;
  onTabChange: (value: string) => void;
  isMobile: boolean;
  canPay: boolean;
  canCreateReceipt: boolean;
  canCreateTransaction: boolean;
  canCreatePayout: boolean;
  onPay: () => void;
  onCreateReceipt: () => void;
  onCreateTransaction: () => void;
  onCreatePayout: () => void;
}

export const FinanceToolbar: React.FC<FinanceToolbarProps> = ({
  tab,
  onTabChange,
  isMobile,
  canPay,
  canCreateReceipt,
  canCreateTransaction,
  canCreatePayout,
  onPay,
  onCreateReceipt,
  onCreateTransaction,
  onCreatePayout,
}) => {
  const { t } = useI18n();
  const tabs = (
    <ListTabs
      value={tab}
      onChange={onTabChange}
      data={[
        { value: 'receipts', label: t('finance.receipts') },
        { value: 'payments', label: t('finance.payments') },
        { value: 'transactions', label: t('finance.transactions') },
        { value: 'payouts', label: t('finance.payouts') },
      ]}
    />
  );

  if (isMobile) {
    return (
      <>
        <ListPageTitle>{t('finance.title')}</ListPageTitle>
        {(tab === 'receipts' || tab === 'payments') && canPay && (
          <Button
            className={listPageStyles.payCta}
            variant="light"
            color="sage"
            size="md"
            radius="md"
            onClick={onPay}
          >
            {t('form.makePayment')}
          </Button>
        )}
        {tabs}
      </>
    );
  }

  return (
    <>
      {tabs}
      {tab === 'receipts' || tab === 'payments' ? (
        <Group gap={8} wrap="nowrap">
          {canPay && (
            <Button variant="light" color="sage" size="sm" onClick={onPay}>
              {t('form.makePayment')}
            </Button>
          )}
          {canCreateReceipt && (
            <Button color="sage.7" rightSection={<PlusIcon size={16} />} size="sm" onClick={onCreateReceipt}>
              {t('form.newReceipt')}
            </Button>
          )}
        </Group>
      ) : null}
      {tab === 'transactions' && canCreateTransaction && (
        <Button color="sage.7" rightSection={<PlusIcon size={16} />} size="sm" onClick={onCreateTransaction}>
          {t('form.newTransaction')}
        </Button>
      )}
      {tab === 'payouts' && canCreatePayout && (
        <Button color="sage.7" rightSection={<PlusIcon size={16} />} size="sm" onClick={onCreatePayout}>
          {t('form.newPayout')}
        </Button>
      )}
    </>
  );
};
