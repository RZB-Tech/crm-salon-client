import { Alert } from '@mantine/core';

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
  if (filteredEmployeesCount === 0 && employeeFilterSize > 0) {
    return (
      <Alert color="gray" title="Фильтр сотрудников" m="md">
        Выберите сотрудников в панели выше или сбросьте фильтр
      </Alert>
    );
  }

  if (boardEmployeesCount === 0) {
    return (
      <Alert color="gray" title="Нет сотрудников с графиком" m="md">
        На выбранную дату нет сотрудников с рабочим графиком
      </Alert>
    );
  }

  return null;
};
