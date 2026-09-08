import { Badge, Button, Group } from '@mantine/core';
import { useI18n } from '@/shared/lib/i18n';

interface PermissionsTreeToolbarProps {
  selectedCount: number;
  totalCount: number;
  allSelected: boolean;
  allExpanded: boolean;
  onToggleExpandAll: () => void;
  onToggleSelectAll: () => void;
}

export function PermissionsTreeToolbar({
  selectedCount,
  totalCount,
  allSelected,
  allExpanded,
  onToggleExpandAll,
  onToggleSelectAll,
}: PermissionsTreeToolbarProps) {
  const { t } = useI18n();
  return (
    <Group justify="space-between" wrap="wrap" mb="xs">
      <Group gap={8}>
        <Button
          variant="light"
          color="sage"
          size="compact-sm"
          radius="xs"
          onClick={onToggleExpandAll}
        >
          {allExpanded ? t('form.collapse') : t('form.expand')}
        </Button>
        <Button
          variant="light"
          color="sage"
          size="compact-sm"
          radius="xs"
          onClick={onToggleSelectAll}
        >
          {allSelected ? t('form.deselectAll') : t('form.selectAll')}
        </Button>
      </Group>
      <Badge size="sm" variant="transparent" color="gray">
        {selectedCount}/{totalCount}
      </Badge>
    </Group>
  );
}
