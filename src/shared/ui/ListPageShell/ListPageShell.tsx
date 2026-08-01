import React from 'react';
import { Box, Group, Pagination as MantinePagination, Select, Text } from '@mantine/core';
import styles from './list-page-shell.module.css';

export const LIST_PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '50', label: '50' },
  { value: '100', label: '100' },
];

interface ListPageShellProps {
  toolbar?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const ListPageShell: React.FC<ListPageShellProps> = ({
  toolbar,
  footer,
  children,
  className,
}) => (
  <Box className={`${styles.page}${className ? ` ${className}` : ''}`}>
    {toolbar != null && <Box className={styles.toolbar}>{toolbar}</Box>}
    <Box className={styles.content}>{children}</Box>
    {footer}
  </Box>
);

interface ListPaginationFooterProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const ListPaginationFooter: React.FC<ListPaginationFooterProps> = ({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <Box className={styles.pagination}>
      <Box className={styles.paginationMeta}>
        <Group gap={8}>
          <Text size="sm" fw={500} c="#484848">
            Показать:
          </Text>
          <Select
            size="xs"
            w={64}
            data={LIST_PAGE_SIZE_OPTIONS}
            value={String(pageSize)}
            onChange={(value) => {
              if (value) onPageSizeChange(Number(value));
            }}
            allowDeselect={false}
          />
        </Group>
        <Text size="sm" c="#484848">
          {from}–{to} из {total}
        </Text>
      </Box>

      <MantinePagination
        value={page}
        onChange={onPageChange}
        total={totalPages}
        size="lg"
        radius="sm"
      />
    </Box>
  );
};

export { styles as listPageStyles };
