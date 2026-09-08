import React from 'react';
import { ScrollArea } from '@mantine/core';
import { ListPageTitle } from '@/shared/ui';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { useI18n } from '@/shared/lib/i18n';
import { useAnalyticsPage } from '../lib/useAnalyticsPage';
import { AnalyticsHero } from './AnalyticsHero';
import { AnalyticsToolbar } from './AnalyticsToolbar';
import { AppointmentsSection } from './AppointmentsSection';
import { EmployeesSection } from './EmployeesSection';
import { MethodsSection } from './MethodsSection';
import { ServicesSection } from './ServicesSection';
import { TransactionsSection } from './TransactionsSection';
import styles from './analytics.module.css';

export const AnalyticsPage: React.FC = () => {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const page = useAnalyticsPage();

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.titleBlock}>
          {isMobile ? (
            <ListPageTitle>{t('nav.analytics')}</ListPageTitle>
          ) : (
            <h1 className={styles.title}>{t('nav.analytics')}</h1>
          )}
          <p className={styles.subtitle}>{page.rangeLabel}</p>
        </div>
        <AnalyticsToolbar
          preset={page.preset}
          startDate={page.startDate}
          endDate={page.endDate}
          branchId={page.branchId}
          branchOptions={page.branchOptions}
          showBranchSelect={page.showBranchSelect}
          onPresetChange={page.setPreset}
          onRangeChange={page.setRange}
          onBranchChange={page.setBranchId}
        />
      </header>
      <ScrollArea className={styles.body}>
        <div className={styles.grid}>
          <AnalyticsHero
            filters={page.filters}
            previousFilters={page.previousFilters}
            canReceipts={page.canReceipts}
            canAppointments={page.canAppointments}
            canTransactions={page.canTransactions}
          />
          {page.canTransactions ? (
            <TransactionsSection
              filters={page.filters}
              period={page.period}
              periodValid={page.periodValid}
              startDate={page.startDate}
              endDate={page.endDate}
              onPeriodChange={page.setPeriod}
            />
          ) : null}
          {page.canTransactions || page.canAppointments ? (
            <div className={styles.split}>
              {page.canTransactions ? <MethodsSection filters={page.filters} /> : null}
              {page.canAppointments ? <AppointmentsSection filters={page.filters} /> : null}
            </div>
          ) : null}
          {page.canEmployees || page.canServices ? (
            <div className={styles.split}>
              {page.canEmployees ? <EmployeesSection filters={page.filters} /> : null}
              {page.canServices ? <ServicesSection filters={page.filters} /> : null}
            </div>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  );
};
