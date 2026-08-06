import { Badge, Button, Group } from '@mantine/core';

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
  return (
    <Group justify="space-between" wrap="nowrap" mb="xs">
      <Badge size="sm" variant="light" color={allSelected ? 'green' : 'gray'}>
        {selectedCount} / {totalCount}
      </Badge>
      <Group gap="xs">
        <Button variant="subtle" size="compact-xs" onClick={onToggleExpandAll}>
          {allExpanded ? 'Свернуть все' : 'Развернуть все'}
        </Button>
        <Button
          variant="light"
          size="compact-xs"
          color={allSelected ? 'red' : 'green'}
          onClick={onToggleSelectAll}
        >
          {allSelected ? 'Снять все' : 'Выбрать все'}
        </Button>
      </Group>
    </Group>
  );
}
