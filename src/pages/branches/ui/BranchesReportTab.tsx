import React from 'react';
import { Alert, Skeleton, Stack, Table, Text } from '@mantine/core';
import { useTenantBranchesReport } from '@/shared/api/hooks/useTenantBranches';
import { formatPrice } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { listPageStyles } from '@/shared/ui';

export const BranchesReportTab: React.FC = () => {
  const { t } = useI18n();
  const { data, isLoading, isError } = useTenantBranchesReport();

  if (isLoading) {
    return (
      <Stack gap="xs" p="md">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} height={48} radius="sm" />
        ))}
      </Stack>
    );
  }

  if (isError) {
    return (
      <Alert color="red" title={t('branches.reportError')} m="md">
        {t('common.checkApi')}
      </Alert>
    );
  }

  const rows = data?.branches ?? [];
  const total = data?.total;

  return (
    <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th className={listPageStyles.headCell}>{t('form.branch')}</Table.Th>
          <Table.Th className={listPageStyles.headCell}>{t('branches.staffs')}</Table.Th>
          <Table.Th className={listPageStyles.headCell}>{t('branches.masters')}</Table.Th>
          <Table.Th className={listPageStyles.headCell}>{t('branches.clients')}</Table.Th>
          <Table.Th className={listPageStyles.headCell}>{t('branches.appointments')}</Table.Th>
          <Table.Th className={listPageStyles.headCell}>{t('branches.services')}</Table.Th>
          <Table.Th className={listPageStyles.headCell}>{t('branches.warehouse')}</Table.Th>
          <Table.Th className={listPageStyles.headCell}>{t('branches.income')}</Table.Th>
          <Table.Th className={listPageStyles.headCell}>{t('branches.expense')}</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rows.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={9}>
              <Text size="sm" c="dimmed" ta="center" py="xl">
                {t('branches.reportEmpty')}
              </Text>
            </Table.Td>
          </Table.Tr>
        ) : (
          rows.map((row) => (
            <Table.Tr key={row.tenant_id} className={listPageStyles.row}>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" fw={600}>
                  {row.tenant_name}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>{row.staffs}</Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>{row.employees}</Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>{row.clients}</Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>{row.appointments}</Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>{row.services}</Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>{row.materials}</Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>{formatPrice(row.income)}</Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>{formatPrice(row.expense)}</Table.Td>
            </Table.Tr>
          ))
        )}
        {total && rows.length > 0 && (
          <Table.Tr className={listPageStyles.row}>
            <Table.Td className={listPageStyles.bodyCell}>
              <Text size="sm" fw={700}>
                {t('common.total')}
              </Text>
            </Table.Td>
            <Table.Td className={listPageStyles.bodyCell}>
              <Text fw={700}>{total.staffs}</Text>
            </Table.Td>
            <Table.Td className={listPageStyles.bodyCell}>
              <Text fw={700}>{total.employees}</Text>
            </Table.Td>
            <Table.Td className={listPageStyles.bodyCell}>
              <Text fw={700}>{total.clients}</Text>
            </Table.Td>
            <Table.Td className={listPageStyles.bodyCell}>
              <Text fw={700}>{total.appointments}</Text>
            </Table.Td>
            <Table.Td className={listPageStyles.bodyCell}>
              <Text fw={700}>{total.services}</Text>
            </Table.Td>
            <Table.Td className={listPageStyles.bodyCell}>
              <Text fw={700}>{total.materials}</Text>
            </Table.Td>
            <Table.Td className={listPageStyles.bodyCell}>
              <Text fw={700}>{formatPrice(total.income)}</Text>
            </Table.Td>
            <Table.Td className={listPageStyles.bodyCell}>
              <Text fw={700}>{formatPrice(total.expense)}</Text>
            </Table.Td>
          </Table.Tr>
        )}
      </Table.Tbody>
    </Table>
  );
};
