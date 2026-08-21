import React from 'react';
import { Box, Card, Text, SimpleGrid, Stack, Group, Badge } from '@mantine/core';
import type { Employee } from '@/shared/api/types';
import { formatPrice } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import styles from '../employee-profile.module.css';

interface OverviewTabProps {
  employee: Employee;
}

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <Box className={styles.salaryItem}>
    <Text size="xs" c="dimmed">{label}</Text>
    <Text size="sm" fw={600}>{value || '—'}</Text>
  </Box>
);

export const OverviewTab: React.FC<OverviewTabProps> = ({ employee }) => {
  const { t } = useI18n();
  const salaryItems = React.useMemo(
    () => [
      { label: t('employees.salaryFixedLabel'), value: employee.salary_fixed ? formatPrice(employee.salary_fixed) : t('common.dash') },
      { label: t('employees.percentFromServices'), value: employee.percent_from_services ? `${employee.percent_from_services} %` : t('common.dash') },
      { label: t('employees.percentFromSales'), value: employee.percent_from_sales ? `${employee.percent_from_sales} %` : t('common.dash') },
    ],
    [employee, t],
  );

  return (
    <Stack gap="md">
      <Card padding="lg" radius="lg" shadow="xs">
        <Group justify="space-between" mb="md">
          <Text fw={600}>{t('clients.personal')}</Text>
          <Badge color={employee.active ? 'green' : 'gray'} variant="light" size="sm">
            {employee.active ? t('form.staffActive') : t('form.staffInactive')}
          </Badge>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
          <InfoItem label={t('common.firstName')} value={employee.firstname} />
          <InfoItem label={t('common.lastName')} value={employee.lastname} />
          <InfoItem label={t('clients.middleName')} value={employee.middlename} />
          <InfoItem label={t('common.phone')} value={employee.phone} />
          <InfoItem label={t('clients.birthDate')} value={employee.birth_date} />
        </SimpleGrid>
      </Card>

      <Card padding="lg" radius="lg" shadow="xs">
        <Text fw={600} mb="md">{t('employees.paymentTerms')}</Text>
        <Box className={styles.salaryGrid}>
          {salaryItems.map((item) => (
            <InfoItem key={item.label} label={item.label} value={item.value} />
          ))}
        </Box>
      </Card>
    </Stack>
  );
};
