import { Button, Modal, MultiSelect, Paper, Stack, Text } from '@mantine/core';

interface AssignRolesModalProps {
  opened: boolean;
  onClose: () => void;
  staffLogin: string;
  rolesOptions: { value: string; label: string }[];
  selectedRoleIds: string[];
  onSelectedRoleIdsChange: (ids: string[]) => void;
  onSave: () => void;
  isPending: boolean;
}

export function AssignRolesModal({
  opened,
  onClose,
  staffLogin,
  rolesOptions,
  selectedRoleIds,
  onSelectedRoleIdsChange,
  onSave,
  isPending,
}: AssignRolesModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={`Роли — ${staffLogin}`} size="sm">
      <Stack gap="sm">
        <MultiSelect
          label="Назначенные роли"
          data={rolesOptions}
          value={selectedRoleIds}
          onChange={onSelectedRoleIdsChange}
          searchable
          placeholder="Выберите роли"
        />
        <Paper p="xs" withBorder>
          <Text size="xs" c="dimmed">
            Текущие права через роли будут применены после сохранения
          </Text>
        </Paper>
        <Button onClick={onSave} loading={isPending}>
          Сохранить
        </Button>
      </Stack>
    </Modal>
  );
}
