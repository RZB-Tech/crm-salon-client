import React from 'react';
import { Box, Group, Select } from '@mantine/core';
import { TRANSACTION_TYPE_OPTIONS } from '@/shared/lib/format';
import { listPageStyles } from '@/shared/ui';
import { CATEGORY_FILTER_OPTIONS, SOURCE_FILTER_OPTIONS } from '../../lib/transactionHelpers';

interface TransactionsFiltersProps {
  typeFilter: string | null;
  categoryFilter: string | null;
  sourceFilter: string | null;
  onTypeChange: (value: string | null) => void;
  onCategoryChange: (value: string | null) => void;
  onSourceChange: (value: string | null) => void;
}

export const TransactionsFilters: React.FC<TransactionsFiltersProps> = ({
  typeFilter,
  categoryFilter,
  sourceFilter,
  onTypeChange,
  onCategoryChange,
  onSourceChange,
}) => (
  <Box className={listPageStyles.panelToolbar}>
    <Group gap="sm" wrap="wrap">
      <Select
        placeholder="Тип"
        clearable
        w={140}
        size="sm"
        data={TRANSACTION_TYPE_OPTIONS}
        value={typeFilter}
        onChange={onTypeChange}
      />
      <Select
        placeholder="Категория"
        clearable
        searchable
        w={180}
        size="sm"
        data={CATEGORY_FILTER_OPTIONS}
        value={categoryFilter}
        onChange={onCategoryChange}
      />
      <Select
        placeholder="Источник"
        clearable
        w={160}
        size="sm"
        data={SOURCE_FILTER_OPTIONS}
        value={sourceFilter}
        onChange={onSourceChange}
      />
    </Group>
  </Box>
);
