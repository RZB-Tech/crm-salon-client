import {
  ActionIcon,
  Alert,
  Button,
  CopyButton,
  Group,
  Modal,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { Check, Copy } from '@phosphor-icons/react';
import type { StaffType } from '@/shared/api/types';
import type { CreateForm } from './types';

interface CreateStaffModalProps {
  opened: boolean;
  onClose: () => void;
  form: CreateForm;
  onFormChange: (form: CreateForm) => void;
  onCreate: () => void;
  isPending: boolean;
  createdPassword: string | null;
}

export function CreateStaffModal({
  opened,
  onClose,
  form,
  onFormChange,
  onCreate,
  isPending,
  createdPassword,
}: CreateStaffModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Новый пользователь" size="md">
      <Stack gap="sm">
        <TextInput
          label="Логин"
          required
          value={form.login}
          onChange={(e) => onFormChange({ ...form, login: e.currentTarget.value })}
        />
        <Group grow>
          <TextInput
            label="Имя"
            value={form.firstname}
            onChange={(e) => onFormChange({ ...form, firstname: e.currentTarget.value })}
          />
          <TextInput
            label="Фамилия"
            value={form.lastname}
            onChange={(e) => onFormChange({ ...form, lastname: e.currentTarget.value })}
          />
        </Group>
        <Select
          label="Тип"
          data={[
            { value: 'employee', label: 'Сотрудник' },
            { value: 'administrator', label: 'Администратор' },
          ]}
          value={form.staff_type}
          onChange={(v) => onFormChange({ ...form, staff_type: (v as StaffType) ?? 'employee' })}
        />
        <PasswordInput
          label="Пароль"
          description="Если не указан, будет сгенерирован автоматически"
          value={form.password}
          onChange={(e) => onFormChange({ ...form, password: e.currentTarget.value })}
          placeholder="Мин. 6 символов"
        />
        <Button onClick={onCreate} loading={isPending} disabled={!form.login}>
          Создать
        </Button>

        {createdPassword && (
          <Alert color="green" title="Пользователь создан">
            <Group gap="xs">
              <Text size="sm">Пароль:</Text>
              <Text size="sm" fw={600} ff="monospace">
                {createdPassword}
              </Text>
              <CopyButton value={createdPassword}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Скопировано' : 'Копировать'}>
                    <ActionIcon variant="subtle" size="sm" onClick={copy}>
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>
          </Alert>
        )}
      </Stack>
    </Modal>
  );
}
