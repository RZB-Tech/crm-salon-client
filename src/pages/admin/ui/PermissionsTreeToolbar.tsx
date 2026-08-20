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
      <Group gap={8}>
        <Button
          variant="light"
          color="sage"
          size="compact-sm"
          radius="xs"
          onClick={onToggleExpandAll}
        >
          {allExpanded ? 'Свернуть' : 'Развернуть'}
        </Button>
        <Button
          variant="light"
          color="sage"
          size="compact-sm"
          radius="xs"
          onClick={onToggleSelectAll}
        >
          {allSelected ? 'Снять все' : 'Выбрать все'}
        </Button>
      </Group>
      <Badge size="sm" variant="transparent" color="gray">
        {selectedCount}/{totalCount}
      </Badge>
    </Group>
  );
}
