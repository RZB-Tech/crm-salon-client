import React from 'react';
import { Button, Group } from '@mantine/core';
import { PlusIcon } from '@phosphor-icons/react';
import { ArchiveToggle, ListCreateFab, ListPageShell, ListPageTitle, ListTabs, listPageStyles } from '@/shared/ui';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { useI18n } from '@/shared/lib/i18n';
import { StaffTab, type StaffTabHandle } from './staff';
import { RolesTab, type RolesTabHandle } from './roles';

export const AdminPage: React.FC = () => {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = React.useState('staff');
  const [showArchivedRoles, setShowArchivedRoles] = React.useState(false);
  const staffRef = React.useRef<StaffTabHandle>(null);
  const rolesRef = React.useRef<RolesTabHandle>(null);

  const openCreate = React.useCallback(() => {
    if (activeTab === 'staff') staffRef.current?.openCreate();
    else rolesRef.current?.openCreate();
  }, [activeTab]);

  const fabLabel = activeTab === 'staff' ? t('admin.createUser') : t('form.createRole');

  return (
    <ListPageShell
      toolbar={
        <>
          {isMobile && <ListPageTitle>{t('admin.title')}</ListPageTitle>}
          <div className={listPageStyles.toolbarRow}>
            <Group justify="space-between" wrap="nowrap" w={isMobile ? '100%' : undefined}>
              <ListTabs
                value={activeTab}
                onChange={setActiveTab}
                data={[
                  { value: 'staff', label: t('admin.staff') },
                  { value: 'roles', label: t('admin.roles') },
                ]}
              />
              {isMobile && activeTab === 'roles' ? (
                <ArchiveToggle
                  className={listPageStyles.archiveBtn}
                  active={showArchivedRoles}
                  onChange={setShowArchivedRoles}
                />
              ) : null}
            </Group>
          </div>
          {!isMobile && (
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
          )}
        </>
      }
      fab={isMobile ? <ListCreateFab label={fabLabel} onClick={openCreate} /> : undefined}
    >
      {activeTab === 'staff' ? (
        <StaffTab ref={staffRef} />
      ) : (
        <RolesTab ref={rolesRef} showArchived={showArchivedRoles} />
      )}
    </ListPageShell>
  );
};
