import React from 'react';

export type SortDir = 'asc' | 'desc';
export type SortValue = string | number | boolean | null | undefined;

export interface TableSortState {
  key: string;
  dir: SortDir;
}

export interface TableSortProps {
  sort: TableSortState;
  onSort: (key: string) => void;
}

export const sortTime = (value: string | null | undefined): number | null => {
  if (!value) return null;
  const time = Date.parse(value);
  return Number.isNaN(time) ? null : time;
};

const isEmpty = (value: SortValue): boolean => value == null || value === '';

export const compareSortValues = (left: SortValue, right: SortValue, dir: SortDir): number => {
  if (isEmpty(left) && isEmpty(right)) return 0;
  if (isEmpty(left)) return 1;
  if (isEmpty(right)) return -1;

  if (typeof left === 'number' && typeof right === 'number') {
    return dir === 'asc' ? left - right : right - left;
  }

  const cmp = String(left).localeCompare(String(right), 'ru', {
    numeric: true,
    sensitivity: 'base',
  });
  return dir === 'asc' ? cmp : -cmp;
};

export function useTableSort<T>(
  items: T[],
  getters: Record<string, (item: T) => SortValue>,
  defaultSort: TableSortState,
) {
  const [sort, setSort] = React.useState<TableSortState>(defaultSort);
  const itemsRef = React.useRef(items);
  const gettersRef = React.useRef(getters);
  itemsRef.current = items;
  gettersRef.current = getters;

  const toggleSort = React.useCallback((key: string) => {
    setSort((prev) => {
      if (!(key in gettersRef.current)) return prev;
      if (prev.key === key) {
        return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' };
      }
      const sample = itemsRef.current[0];
      const sampleValue = sample ? gettersRef.current[key](sample) : null;
      return { key, dir: typeof sampleValue === 'number' ? 'desc' : 'asc' };
    });
  }, []);

  const sortedItems = React.useMemo(() => {
    const get = getters[sort.key];
    if (!get) return items;
    return [...items].sort((a, b) => compareSortValues(get(a), get(b), sort.dir));
  }, [items, getters, sort]);

  return { sort, sortedItems, toggleSort };
}
