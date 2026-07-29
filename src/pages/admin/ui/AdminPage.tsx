import React from 'react';
import { Tabs } from '@mantine/core';
import { ListPage } from '@/shared/ui';
import { StaffTab } from './StaffTab';
import { RolesTab } from './RolesTab';


export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<string | null>('staff');

  return (
    <ListPage title="Администрирование" subtitle="Пользователи, роли и права доступа">
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="staff">Пользователи</Tabs.Tab>
          <Tabs.Tab value="roles">Роли</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="staff" pt="md">
          <StaffTab />
        </Tabs.Panel>

        <Tabs.Panel value="roles" pt="md">
          <RolesTab />
        </Tabs.Panel>
      </Tabs>
    </ListPage>
  );
};
