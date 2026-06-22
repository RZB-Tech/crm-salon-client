import React from 'react';
import { Card, Text, SimpleGrid, Stack, Group, Badge } from '@mantine/core';
import type { Employee } from '@/shared/api/types';
import { formatPrice } from '@/shared/lib/format';
import styles from '../employee-profile.module.css';

interface OverviewTabProps {
  employee: Employee;
}

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <div className={styles.salaryItem}>
    <Text size="xs" c="dimmed">{label}</Text>
    <Text size="sm" fw={600}>{value || '—'}</Text>
  </div>
);

export const OverviewTab: React.FC<OverviewTabProps> = ({ employee }) => {
  const salaryItems = React.useMemo(
    () => [
      { label: 'Фиксированная', value: employee.salary_fixed ? formatPrice(employee.salary_fixed) : '—' },
      { label: '% от услуг', value: employee.percent_from_services ? `${employee.percent_from_services} %` : '—' },
      { label: '% от продаж', value: employee.percent_from_sales ? `${employee.percent_from_sales} %` : '—' },
    ],
    [employee],
  );

  return (
    <Stack gap="md">
      <Card padding="lg" radius="lg" shadow="xs">
        <Group justify="space-between" mb="md">
          <Text fw={600}>Личные данные</Text>
          <Badge color={employee.active ? 'green' : 'gray'} variant="light" size="sm">
            {employee.active ? 'Активен' : 'Неактивен'}
          </Badge>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
          <InfoItem label="Имя" value={employee.firstname} />
          <InfoItem label="Фамилия" value={employee.lastname} />
          <InfoItem label="Отчество" value={employee.middlename} />
          <InfoItem label="Телефон" value={employee.phone} />
          <InfoItem label="Дата рождения" value={employee.birth_date} />
        </SimpleGrid>
      </Card>

      <Card padding="lg" radius="lg" shadow="xs">
        <Text fw={600} mb="md">Условия оплаты</Text>
        <div className={styles.salaryGrid}>
          {salaryItems.map((item) => (
            <InfoItem key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </Card>
    </Stack>
  );
};
