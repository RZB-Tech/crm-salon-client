import React from 'react';
import { Group, Text, ActionIcon, Select } from '@mantine/core';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
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

  const handlePrev = React.useCallback(() => {
    if (page > 1) onPageChange(page - 1);
  }, [page, onPageChange]);

  const handleNext = React.useCallback(() => {
    if (page < totalPages) onPageChange(page + 1);
  }, [page, totalPages, onPageChange]);

  if (total <= pageSize && !onPageSizeChange) return null;

  return (
    <Group className={styles.root} justify="space-between">
      <Group gap="sm">
        {onPageSizeChange && (
          <>
            <Text size="sm" c="dimmed">
              Показать:
            </Text>
            <Select
              size="xs"
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
        <Text size="sm" c="dimmed">
          {from}–{to} из {total}
        </Text>
      </Group>

      <Group gap={4}>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          disabled={page <= 1}
          onClick={handlePrev}
          aria-label="Предыдущая страница"
        >
          <CaretLeft size={16} />
        </ActionIcon>
        <Text size="sm" fw={500} className={styles.pageLabel}>
          {page} / {totalPages}
        </Text>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          disabled={page >= totalPages}
          onClick={handleNext}
          aria-label="Следующая страница"
        >
          <CaretRight size={16} />
        </ActionIcon>
      </Group>
    </Group>
  );
};
