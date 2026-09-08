import React from 'react';
import { AppShell, Portal } from '@mantine/core';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '@/widgets/header';
import { Sidebar } from '@/widgets/sidebar';
import { PageTransition } from '@/shared/ui/PageTransition';
import { useI18n } from '@/shared/lib/i18n';
import styles from './app-layout.module.css';

/** base — ноутбук, xl (≥88em) — большой монитор */
const SIDEBAR_WIDTH = { base: 220, xl: 280 } as const;
const SIDEBAR_COLLAPSED_WIDTH = { base: 60, xl: 72 } as const;

export const AppLayout: React.FC = () => {
  const { t } = useI18n();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpened, setMobileOpened] = React.useState(false);

  React.useEffect(() => {
    setMobileOpened(false);
  }, [location.pathname]);

  React.useEffect(() => {
    if (!isMobile) setMobileOpened(false);
  }, [isMobile]);

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((current) => !current);
  }, []);

  const toggleMobile = React.useCallback(() => {
    setMobileOpened((current) => !current);
  }, []);

  const closeMobile = React.useCallback(() => {
    setMobileOpened(false);
  }, []);

  const navbarWidth = {
    base: isMobile ? '100%' : SIDEBAR_WIDTH.base,
    sm: collapsed ? SIDEBAR_COLLAPSED_WIDTH.base : SIDEBAR_WIDTH.base,
    xl: collapsed ? SIDEBAR_COLLAPSED_WIDTH.xl : SIDEBAR_WIDTH.xl,
  };

  return (
    <AppShell
      header={{ height: { base: 56, xl: 64 } }}
      navbar={{
        width: navbarWidth,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened },
      }}
      padding={0}
      classNames={{ root: styles.root, main: styles.main }}
      transitionDuration={220}
    >
      <AppShell.Header>
        <Header
          collapsed={collapsed}
          onToggle={toggleCollapsed}
          mobileOpened={mobileOpened}
          onMobileToggle={toggleMobile}
        />
      </AppShell.Header>

      <AppShell.Navbar>
        <Sidebar collapsed={mobileOpened ? false : collapsed} />
      </AppShell.Navbar>

      {mobileOpened && !isMobile && (
        <Portal>
          <button
            type="button"
            className={styles.mobileNavOverlay}
            aria-label={t('header.close')}
            onClick={closeMobile}
          />
        </Portal>
      )}

      <AppShell.Main>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </AppShell.Main>
    </AppShell>
  );
};
