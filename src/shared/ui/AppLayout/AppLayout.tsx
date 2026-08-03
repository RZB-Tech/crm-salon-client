import React from 'react';
import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { Header } from '@/widgets/header';
import { Sidebar } from '@/widgets/sidebar';
import { PageTransition } from '@/shared/ui/PageTransition';
import styles from './app-layout.module.css';

/** base — ноутбук, xl (≥88em) — большой монитор */
const SIDEBAR_WIDTH = { base: 220, xl: 280 } as const;
const SIDEBAR_COLLAPSED_WIDTH = { base: 60, xl: 72 } as const;

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((c) => !c);
  }, []);

  return (
    <AppShell
      header={{ height: { base: 56, xl: 64 } }}
      navbar={{
        width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        breakpoint: 'sm',
      }}
      padding={0}
      classNames={{ root: styles.root, main: styles.main }}
      transitionDuration={220}
    >
      <AppShell.Header>
        <Header collapsed={collapsed} onToggle={toggleCollapsed} />
      </AppShell.Header>

      <AppShell.Navbar>
        <Sidebar collapsed={collapsed} />
      </AppShell.Navbar>

      <AppShell.Main>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </AppShell.Main>
    </AppShell>
  );
};
