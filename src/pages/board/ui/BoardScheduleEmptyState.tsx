import { Alert } from '@mantine/core';
import { useI18n } from '@/shared/lib/i18n';

interface BoardScheduleEmptyStateProps {
  filteredEmployeesCount: number;
  employeeFilterSize: number;
  boardEmployeesCount: number;
}

export function BoardScheduleEmptyState({
  filteredEmployeesCount,
  employeeFilterSize,
  boardEmployeesCount,
}: BoardScheduleEmptyStateProps) {
  const { t } = useI18n();
  if (filteredEmployeesCount === 0 && employeeFilterSize > 0) {
    return (
      <Alert color="gray" title={t('board.filterEmployees')} m="md">
        {t('board.filterEmployeesHint')}
      </Alert>
    );
  }

  if (boardEmployeesCount === 0) {
    return (
      <Alert color="gray" title={t('board.noScheduledEmployees')} m="md">
        {t('board.noScheduledEmployeesHint')}
      </Alert>
    );
  }

  return null;
};
