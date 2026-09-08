import React from 'react';
import { Box, Group, Select, Stack, UnstyledButton } from '@mantine/core';
import { FunnelIcon } from '@phosphor-icons/react';
import { TRANSACTION_TYPE_OPTIONS } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { FilterDrawer, FilterDrawerFooter, listPageStyles } from '@/shared/ui';
import { CATEGORY_FILTER_OPTIONS, SOURCE_FILTER_OPTIONS } from '../../lib/transactionHelpers';

interface TransactionsFiltersProps {
  typeFilter: string | null;
  categoryFilter: string | null;
  sourceFilter: string | null;
  onTypeChange: (value: string | null) => void;
  onCategoryChange: (value: string | null) => void;
  onSourceChange: (value: string | null) => void;
}

interface FilterDraft {
  type: string | null;
  category: string | null;
  source: string | null;
}

export const TransactionsFilters: React.FC<TransactionsFiltersProps> = ({
  typeFilter,
  categoryFilter,
  sourceFilter,
  onTypeChange,
  onCategoryChange,
  onSourceChange,
}) => {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const [opened, setOpened] = React.useState(false);
  const [draft, setDraft] = React.useState<FilterDraft>({
    type: typeFilter,
    category: categoryFilter,
    source: sourceFilter,
  });
  const active = Boolean(typeFilter || categoryFilter || sourceFilter);

  const openDrawer = React.useCallback(() => {
    setDraft({ type: typeFilter, category: categoryFilter, source: sourceFilter });
    setOpened(true);
  }, [typeFilter, categoryFilter, sourceFilter]);

  const fields = (
    <Stack gap="sm">
      <Select
        placeholder={t('form.type')}
        clearable
        w={isMobile ? '100%' : 140}
        size="sm"
        data={TRANSACTION_TYPE_OPTIONS()}
        value={isMobile ? draft.type : typeFilter}
        onChange={isMobile ? (value) => setDraft((prev) => ({ ...prev, type: value })) : onTypeChange}
      />
      <Select
        placeholder={t('form.category')}
        clearable
        searchable
        w={isMobile ? '100%' : 180}
        size="sm"
        data={CATEGORY_FILTER_OPTIONS()}
        value={isMobile ? draft.category : categoryFilter}
        onChange={
          isMobile ? (value) => setDraft((prev) => ({ ...prev, category: value })) : onCategoryChange
        }
      />
      <Select
        placeholder={t('form.source')}
        clearable
        w={isMobile ? '100%' : 160}
        size="sm"
        data={SOURCE_FILTER_OPTIONS()}
        value={isMobile ? draft.source : sourceFilter}
        onChange={
          isMobile ? (value) => setDraft((prev) => ({ ...prev, source: value })) : onSourceChange
        }
      />
    </Stack>
  );

  if (!isMobile) {
    return (
      <Box className={listPageStyles.panelToolbar}>
        <Group gap="sm" wrap="wrap">
          {fields.props.children}
        </Group>
      </Box>
    );
  }

  return (
    <Box className={listPageStyles.panelToolbar}>
      <UnstyledButton
        className={`${listPageStyles.filterTrigger}${active ? ` ${listPageStyles.filterTriggerActive}` : ''}`}
        onClick={openDrawer}
      >
        <span>{t('common.filters')}</span>
        <FunnelIcon size={20} />
      </UnstyledButton>
      <FilterDrawer
        opened={opened}
        onClose={() => setOpened(false)}
        title={t('common.filters')}
        footer={
          <FilterDrawerFooter
            onReset={() => {
              setDraft({ type: null, category: null, source: null });
              onTypeChange(null);
              onCategoryChange(null);
              onSourceChange(null);
              setOpened(false);
            }}
            onApply={() => {
              onTypeChange(draft.type);
              onCategoryChange(draft.category);
              onSourceChange(draft.source);
              setOpened(false);
            }}
          />
        }
      >
        {fields}
      </FilterDrawer>
    </Box>
  );
};
