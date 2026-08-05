import React from 'react';
import {
  ActionIcon,
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CopyButton,
  Group,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  ArchiveIcon,
  ArrowLeftIcon,
  CakeIcon,
  CheckIcon,
  CopyIcon,
  LockKeyIcon,
  PencilSimpleIcon,
  PhoneIcon,
} from '@phosphor-icons/react';
import type { Employee } from '@/shared/api/types';
import { getEmployeeFullName, getEmployeeInitials } from '@/shared/lib/format';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import styles from './employee-profile.module.css';

export interface EmployeeProfileHeaderProps {
  employee: Employee;
  resetPasswordResult: string | null;
  resetPasswordPending: boolean;
  onBack: () => void;
  onEdit: () => void;
  onResetPassword: () => void;
  onArchive: () => void;
  onDismissPasswordResult: () => void;
}

export const EmployeeProfileHeader: React.FC<EmployeeProfileHeaderProps> = ({
  employee,
  resetPasswordResult,
  resetPasswordPending,
  onBack,
  onEdit,
  onResetPassword,
  onArchive,
  onDismissPasswordResult,
}) => {
  const { hasPermission } = useAccess();

  return (
    <Box className={styles.pageTop}>
      <Button
        variant="subtle"
        color="gray"
        leftSection={<ArrowLeftIcon size={16} />}
        onClick={onBack}
        w="fit-content"
      >
        К сотрудникам
      </Button>

      <Card padding="md" radius="md" withBorder className={styles.headerCard}>
        <Box className={styles.headerLeft}>
          <Avatar radius="md" size={64} color="sage">
            {getEmployeeInitials(employee)}
          </Avatar>
          <Box>
            <Group gap={10}>
              <Text fw={700} size="xl">
                {getEmployeeFullName(employee)}
              </Text>
              <Badge color={employee.active ? 'green' : 'gray'} variant="light" size="sm">
                {employee.active ? 'Активен' : 'Неактивен'}
              </Badge>
            </Group>
            <Box className={styles.contactRow}>
              <Group gap={5}>
                <PhoneIcon size={14} color="var(--mantine-color-gray-5)" />
                <Text size="sm" c="dimmed">
                  {employee.phone || '—'}
                </Text>
              </Group>
              <Group gap={5}>
                <CakeIcon size={14} color="var(--mantine-color-gray-5)" />
                <Text size="sm" c="dimmed">
                  {employee.birth_date || '—'}
                </Text>
              </Group>
            </Box>
          </Box>
        </Box>

        <Group gap="sm">
          {hasPermission(PermissionCode.EMPLOYEE_UPDATE) && (
            <Button variant="light" leftSection={<PencilSimpleIcon size={16} />} onClick={onEdit}>
              Редактировать
            </Button>
          )}
          {hasPermission(PermissionCode.EMPLOYEE_MANAGE) && (
            <>
              <Button
                variant="light"
                leftSection={<LockKeyIcon size={16} />}
                onClick={onResetPassword}
                loading={resetPasswordPending}
              >
                Сбросить пароль
              </Button>
              {employee.active && (
                <ActionIcon
                  variant="light"
                  color="orange"
                  size="lg"
                  aria-label="Архивировать"
                  onClick={onArchive}
                >
                  <ArchiveIcon size={18} />
                </ActionIcon>
              )}
            </>
          )}
        </Group>
      </Card>

      {resetPasswordResult && (
        <Alert color="sage" title="Пароль сброшен" onClose={onDismissPasswordResult} withCloseButton>
          <Group gap="sm">
            <Text size="sm" fw={600} component="div">
              Новый пароль:{' '}
              <Box
                component="code"
                style={{
                  fontFamily: 'monospace',
                  background: 'var(--mantine-color-gray-1)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                {resetPasswordResult}
              </Box>
            </Text>
            <CopyButton value={resetPasswordResult}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Скопировано!' : 'Скопировать'} withArrow>
                  <ActionIcon color={copied ? 'teal' : 'sage'} variant="light" onClick={copy} size="sm">
                    {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </Group>
          <Text size="xs" c="dimmed" mt="xs">
            Обязательно передайте этот пароль сотруднику
          </Text>
        </Alert>
      )}
    </Box>
  );
};
