import { Button, Divider, Drawer, Group, Stack } from '@mantine/core';
import type { Permission, Staff } from '@/shared/api/types';
import { StaffDetailHeader } from './StaffDetailHeader';
import { StaffDetailInfo } from './StaffDetailInfo';
import { StaffRolesSection } from './StaffRolesSection';
import { StaffPermissionsSection } from './StaffPermissionsSection';

interface StaffDetailDrawerProps {
  opened: boolean;
  onClose: () => void;
  staff: Staff | null;
  getPermissionNames: (codes: number[]) => Permission[];
  onOpenRoles: (staff: Staff) => void;
  onOpenPerms: (staff: Staff) => void;
  onOpenReset: (staff: Staff) => void;
}

export function StaffDetailDrawer({
  opened,
  onClose,
  staff,
  getPermissionNames,
  onOpenRoles,
  onOpenPerms,
  onOpenReset,
}: StaffDetailDrawerProps) {
  return (
    <Drawer opened={opened} onClose={onClose} title="Карточка пользователя" position="right" size="md">
      {staff && (
        <Stack gap="md">
          <StaffDetailHeader staff={staff} />
          <StaffDetailInfo staff={staff} />
          <StaffRolesSection staff={staff} onEdit={onOpenRoles} />
          <StaffPermissionsSection
            staff={staff}
            getPermissionNames={getPermissionNames}
            onEdit={onOpenPerms}
          />
          <Divider />
          <Group>
            <Button variant="light" color="orange" size="sm" onClick={() => onOpenReset(staff)}>
              Сбросить пароль
            </Button>
          </Group>
        </Stack>
      )}
    </Drawer>
  );
}
