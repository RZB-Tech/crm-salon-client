import { Text } from '@mantine/core';
import { formatDateTime } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { FormFieldGrid, FormSection } from '@/shared/ui';
import type { Staff } from '@/shared/api/types';

interface StaffDetailInfoProps {
  staff: Staff;
}

export function StaffDetailInfo({ staff }: StaffDetailInfoProps) {
  const { t } = useI18n();
  const infoRows: { label: string; value: string }[] = [
    { label: 'ID', value: String(staff.id) },
    { label: t('common.login'), value: staff.login },
    { label: t('common.firstName'), value: staff.firstname || t('common.dash') },
    { label: t('common.lastName'), value: staff.lastname || t('common.dash') },
    { label: t('clients.middleName'), value: staff.middlename || t('common.dash') },
    {
      label: t('admin.linkedEmployee'),
      value: staff.employee_id ? `#${staff.employee_id}` : t('common.dash'),
    },
    { label: t('admin.created'), value: formatDateTime(staff.created_at) },
    { label: t('admin.updated'), value: formatDateTime(staff.updated_at) },
  ];

  return (
    <FormSection title={t('admin.account')}>
      <FormFieldGrid cols={2}>
        {infoRows.map((row) => (
          <div key={row.label}>
            <Text size="xs" c="dimmed">
              {row.label}
            </Text>
            <Text size="sm" fw={500}>
              {row.value}
            </Text>
          </div>
        ))}
      </FormFieldGrid>
    </FormSection>
  );
}
