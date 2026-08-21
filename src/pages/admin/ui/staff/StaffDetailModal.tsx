import { Badge, Button } from '@mantine/core';
import { KeyIcon, UserIcon } from '@phosphor-icons/react';
import type { Permission, Staff } from '@/shared/api/types';
import { useI18n } from '@/shared/lib/i18n';
import { FormModal, FormModalFooter } from '@/shared/ui';
import { getStaffFullName, getStaffInitials } from '../../lib/staffDisplay';
import { PasswordResultAlert } from './PasswordResultAlert';
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
  resetResult?: string | null;
}

export function StaffDetailModal({
  opened,
  onClose,
  staff,
  getPermissionNames,
  onOpenRoles,
  onOpenPerms,
  onOpenReset,
  resetResult,
}: StaffDetailModalProps) {
  const { t } = useI18n();
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
          {staff.active ? t('form.staffActive') : t('form.staffInactive')}
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
      size={567}
      footer={
        <FormModalFooter
          cancelLabel={t('common.close')}
          onCancel={onClose}
          dangerActions={
            <Button
              variant="subtle"
              color="orange"
              size="sm"
              leftSection={<KeyIcon size={14} />}
              onClick={() => onOpenReset(staff)}
            >
              {t('form.resetPasswordAction')}
            </Button>
          }
        />
      }
    >
      {resetResult ? (
        <PasswordResultAlert
          title={t('form.passwordResetTitle')}
          label={t('form.newPasswordLabel')}
          password={resetResult}
        />
      ) : null}
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
