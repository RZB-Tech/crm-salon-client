import React from 'react';
import type { TenantBranchReportItem } from '@/shared/api/types';
import { ListCardField, ListEntityCard, listPageStyles } from '@/shared/ui';
import { formatPrice } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';

interface BranchReportMobileCardProps {
  title: string;
  item: Omit<TenantBranchReportItem, 'tenant_id' | 'tenant_name'> & { tenant_name?: string };
}

export const BranchReportMobileCard: React.FC<BranchReportMobileCardProps> = ({ title, item }) => {
  const { t } = useI18n();

  return (
    <ListEntityCard>
      <p className={listPageStyles.cardTitle}>{title}</p>
      <div className={listPageStyles.cardFields}>
        <ListCardField label={t('branches.staffs')} value={item.staffs} />
        <ListCardField label={t('branches.masters')} value={item.employees} />
        <ListCardField label={t('branches.clients')} value={item.clients} />
        <ListCardField label={t('branches.appointments')} value={item.appointments} />
        <ListCardField label={t('branches.services')} value={item.services} />
        <ListCardField label={t('branches.warehouse')} value={item.materials} />
        <ListCardField label={t('branches.income')} value={formatPrice(item.income)} />
        <ListCardField label={t('branches.expense')} value={formatPrice(item.expense)} />
      </div>
    </ListEntityCard>
  );
};
