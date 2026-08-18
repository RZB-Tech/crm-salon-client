import React from 'react';
import { Button } from '@mantine/core';
import styles from './filter-drawer.module.css';

interface FilterDrawerFooterProps {
  onReset: () => void;
  onApply: () => void;
}

export const FilterDrawerFooter: React.FC<FilterDrawerFooterProps> = ({ onReset, onApply }) => (
  <footer className={styles.footer}>
    <Button variant="outline" color="sage" size="md" radius="md" onClick={onReset}>
      Сбросить фильтры
    </Button>
    <Button color="sage" size="md" radius="md" onClick={onApply}>
      Применить фильтры
    </Button>
  </footer>
);
