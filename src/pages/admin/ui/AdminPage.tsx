import React from 'react';
import { Button, Group } from '@mantine/core';
import { PlusIcon } from '@phosphor-icons/react';
import { ArchiveToggle, ListPageShell, ListTabs } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { StaffTab, type StaffTabHandle } from './staff';
import { RolesTab, type RolesTabHandle } from './roles';

export const AdminPage: React.FC = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = React.useState('staff');
  const [showArchivedRoles, setShowArchivedRoles] = React.useState(false);
  const staffRef = React.useRef<StaffTabHandle>(null);
  const rolesRef = React.useRef<RolesTabHandle>(null);

  return (
    <ListPageShell
      toolbar={
        <>
          <ListTabs
            value={activeTab}
            onChange={setActiveTab}
            data={[
              { value: 'staff', label: t('admin.staff') },
              { value: 'roles', label: t('admin.roles') },
            ]}
          />
          <Group gap={8} wrap="nowrap">
            {activeTab === 'staff' && (
              <Button
                color="sage.7"
                size="sm"
                rightSection={<PlusIcon size={16} />}
                onClick={() => staffRef.current?.openCreate()}
              >
                {t('admin.createUser')}
              </Button>
            )}
            {activeTab === 'roles' && (
              <>
                <Button
                  color="sage.7"
                  size="sm"
                  rightSection={<PlusIcon size={16} />}
                  onClick={() => rolesRef.current?.openCreate()}
                >
                  {t('form.createRole')}
                </Button>
                <ArchiveToggle active={showArchivedRoles} onChange={setShowArchivedRoles} />
              </>
            )}
          </Group>
        </>
      }
    >
      {activeTab === 'staff' ? (
        <StaffTab ref={staffRef} />
      ) : (
        <RolesTab ref={rolesRef} showArchived={showArchivedRoles} />
      )}
    </ListPageShell>
  );
};
