import React from 'react';
import { Button } from '@mantine/core';
import { useI18n } from '@/shared/lib/i18n';
import styles from './filter-drawer.module.css';

interface FilterDrawerFooterProps {
  onReset: () => void;
  onApply: () => void;
}

export const FilterDrawerFooter: React.FC<FilterDrawerFooterProps> = ({ onReset, onApply }) => {
  const { t } = useI18n();
  return (
  <footer className={styles.footer}>
    <Button variant="outline" color="sage" size="md" radius="md" onClick={onReset}>
      {t('common.resetFilters')}
    </Button>
    <Button color="sage" size="md" radius="md" onClick={onApply}>
      {t('common.applyFilters')}
    </Button>
  </footer>
  );
};
