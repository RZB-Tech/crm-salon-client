import { Badge, Button } from '@mantine/core';
import { KeyIcon, UserIcon } from '@phosphor-icons/react';
import type { Permission, Staff } from '@/shared/api/types';
import { FormModal, FormModalFooter } from '@/shared/ui';
import { getStaffFullName, getStaffInitials } from '../../lib/staffDisplay';
import { StaffDetailInfo } from './StaffDetailInfo';
import { StaffRolesSection } from './StaffRolesSection';
import { StaffPermissionsSection } from './StaffPermissionsSection';

interface StaffDetailModalProps {
  opened: boolean;
  onClose: () => void;
  staff: Staff | null;
  getPermissionNames: (codes: number[]) => Permission[];
  onOpenRoles: (staff: Staff) => void;
  onOpenPerms: (staff: Staff) => void;
  onOpenReset: (staff: Staff) => void;
}

export function StaffDetailModal({
  opened,
  onClose,
  staff,
  getPermissionNames,
  onOpenRoles,
  onOpenPerms,
  onOpenReset,
}: StaffDetailModalProps) {
  if (!staff) return null;

  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title={getStaffFullName(staff)}
      subtitle={staff.login}
      initials={getStaffInitials(staff)}
      icon={<UserIcon size={22} />}
      headerAside={
        <Badge color={staff.active ? 'green' : 'gray'} variant="dot" size="lg">
          {staff.active ? 'Активен' : 'Неактивен'}
        </Badge>
      }
      badges={
        staff.roles.length > 0
          ? staff.roles.map((role) => (
              <Badge key={role.id} variant="light" color="blue" size="sm">
                {role.name}
              </Badge>
            ))
          : undefined
      }
      size="lg"
      footer={
        <FormModalFooter
          cancelLabel="Закрыть"
          onCancel={onClose}
          dangerActions={
            <Button
              variant="subtle"
              color="orange"
              size="sm"
              leftSection={<KeyIcon size={14} />}
              onClick={() => onOpenReset(staff)}
            >
              Сбросить пароль
            </Button>
          }
        />
      }
    >
      <StaffDetailInfo staff={staff} />
      <StaffRolesSection staff={staff} onEdit={onOpenRoles} />
      <StaffPermissionsSection
        staff={staff}
        getPermissionNames={getPermissionNames}
        onEdit={onOpenPerms}
      />
    </FormModal>
  );
}
