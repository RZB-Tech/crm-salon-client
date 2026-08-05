import React from 'react';
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Card,
  Divider,
  Group,
  Text,
} from '@mantine/core';
import { ArchiveIcon, ArrowCounterClockwiseIcon } from '@phosphor-icons/react';
import type { Employee } from '@/shared/api/types';
import { formatPrice, getEmployeeFullName, getEmployeeInitials } from '@/shared/lib/format';
import styles from './employees-page.module.css';

export interface EmployeeCardProps {
  employee: Employee;
  specializationName: string | null;
  showArchived: boolean;
  canManage: boolean;
  onOpen: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onRestore: (employee: Employee) => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  specializationName,
  showArchived,
  canManage,
  onOpen,
  onDelete,
  onRestore,
}) => {
  const servicesCount = employee.services?.length ?? 0;

  return (
    <Card
      padding="lg"
      radius="md"
      className={styles.card}
      onClick={() => onOpen(employee)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onOpen(employee);
      }}
    >
      <Group justify="space-between" align="flex-start" mb="md">
        <Group gap={12}>
          <Avatar radius="md" size="lg" color="sage">
            {getEmployeeInitials(employee)}
          </Avatar>
          <Box>
            <Text fw={600} size="sm" c="#484848">
              {getEmployeeFullName(employee)}
            </Text>
            <Text size="sm" c="rgba(72,72,72,0.4)">
              {specializationName ?? employee.phone ?? '—'}
            </Text>
          </Box>
        </Group>
        <Group gap={6}>
          <Badge color={employee.active ? 'green' : 'gray'} variant="light" size="sm">
            {employee.active ? 'Активен' : 'Неактивен'}
          </Badge>
          {canManage &&
            (showArchived ? (
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                aria-label="Восстановить"
                onClick={(e) => {
                  e.stopPropagation();
                  onRestore(employee);
                }}
              >
                <ArrowCounterClockwiseIcon size={18} />
              </ActionIcon>
            ) : (
              <ActionIcon
                variant="subtle"
                color="orange"
                size="sm"
                aria-label="Архивировать"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(employee);
                }}
              >
                <ArchiveIcon size={18} />
              </ActionIcon>
            ))}
        </Group>
      </Group>

      <Group gap={6} mb="md">
        <Badge size="xs" variant="light" color="gray">
          Услуг: {servicesCount}
        </Badge>
        {employee.salary_fixed > 0 && (
          <Badge size="xs" variant="light" color="sage">
            Фикс: {formatPrice(employee.salary_fixed)}
          </Badge>
        )}
        {employee.percent_from_services > 0 && (
          <Badge size="xs" variant="light" color="teal">
            % услуг: {employee.percent_from_services}
          </Badge>
        )}
      </Group>

      <Divider mb="md" />
      <Text size="xs" c="dimmed">
        Дата рождения: {employee.birth_date}
      </Text>
    </Card>
  );
};
