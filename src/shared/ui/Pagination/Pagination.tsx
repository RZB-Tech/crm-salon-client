import React from 'react';
import { Group, Pagination as MantinePagination, Select, Text } from '@mantine/core';
import styles from './pagination.module.css';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  if (total <= pageSize && !onPageSizeChange) return null;

  return (
    <Group
      justify='space-between'
      py='sm'
      px='md'
      className={styles.root}
    >
      <Group gap='sm'>
        {onPageSizeChange && (
          <>
            <Text size='sm' c='dimmed'>
              Показать:
            </Text>
            <Select
              size='xs'
              w={72}
              data={pageSizeOptions.map((size) => ({
                value: String(size),
                label: String(size),
              }))}
              value={String(pageSize)}
              onChange={(value) => {
                if (value) onPageSizeChange(Number(value));
              }}
              allowDeselect={false}
            />
          </>
        )}
        <Text size='sm' c='dimmed'>
          {from}–{to} из {total}
        </Text>
      </Group>

      <MantinePagination
        value={page}
        onChange={onPageChange}
        total={totalPages}
        size='sm'
        radius='md'
      />
    </Group>
  );
};
