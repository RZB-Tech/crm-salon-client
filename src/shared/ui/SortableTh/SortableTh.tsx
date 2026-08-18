import React from 'react';
import { Table } from '@mantine/core';
import { CaretDownIcon, CaretUpIcon } from '@phosphor-icons/react';
import { listPageStyles } from '@/shared/ui/ListPageShell';
import type { TableSortState } from '@/shared/lib/hooks/useTableSort';
import styles from './sortable-th.module.css';

interface SortableThProps {
  column: string;
  sort: TableSortState;
  onSort: (key: string) => void;
  children: React.ReactNode;
  w?: React.CSSProperties['width'];
  miw?: React.CSSProperties['minWidth'];
}

export const SortableTh: React.FC<SortableThProps> = ({
  column,
  sort,
  onSort,
  children,
  w,
  miw,
}) => {
  const active = sort.key === column;

  return (
    <Table.Th
      className={listPageStyles.headCell}
      w={w}
      miw={miw}
      aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <button type="button" className={styles.button} onClick={() => onSort(column)}>
        <span>{children}</span>
        <span className={styles.arrows} aria-hidden>
          <span className={styles.arrow} data-active={active && sort.dir === 'asc' ? true : undefined}>
            <CaretUpIcon size={8} weight="fill" />
          </span>
          <span className={styles.arrow} data-active={active && sort.dir === 'desc' ? true : undefined}>
            <CaretDownIcon size={8} weight="fill" />
          </span>
        </span>
      </button>
    </Table.Th>
  );
};
