import {
  Badge,
  Checkbox,
  Collapse,
  Group,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { CaretDownIcon, CaretRightIcon } from '@phosphor-icons/react';
import type { Permission } from '@/shared/api/types';

interface PermissionsResourceTreeProps {
  permissionsByResource: Record<string, Permission[]>;
  selectedPerms: number[];
  expandedResources: Set<string>;
  onTogglePermission: (code: number) => void;
  onToggleResource: (resource: string, codes: number[]) => void;
  onToggleExpanded: (resource: string) => void;
  maxHeight?: number;
}

export function PermissionsResourceTree({
  permissionsByResource,
  selectedPerms,
  expandedResources,
  onTogglePermission,
  onToggleResource,
  onToggleExpanded,
  maxHeight = 400,
}: PermissionsResourceTreeProps) {
  return (
    <ScrollArea.Autosize mah={maxHeight} type="auto">
      <Stack gap="xs">
        {Object.entries(permissionsByResource).map(([resource, perms]) => {
          const codes = perms.map((p) => p.code);
          const selectedInGroup = codes.filter((c) => selectedPerms.includes(c)).length;
          const allInGroupSelected = selectedInGroup === codes.length;
          const partialInGroup = selectedInGroup > 0 && !allInGroupSelected;
          const isExpanded = expandedResources.has(resource);

          return (
            <Paper key={resource} p="xs" withBorder>
              <Group justify="space-between" wrap="nowrap">
                <UnstyledButton onClick={() => onToggleExpanded(resource)} style={{ flex: 1 }}>
                  <Group gap="xs">
                    {isExpanded ? <CaretDownIcon size={14} /> : <CaretRightIcon size={14} />}
                    <Text size="xs" fw={600} tt="uppercase">
                      {resource}
                    </Text>
                    <Badge
                      size="xs"
                      variant="light"
                      color={allInGroupSelected ? 'green' : partialInGroup ? 'yellow' : 'gray'}
                    >
                      {selectedInGroup}/{codes.length}
                    </Badge>
                  </Group>
                </UnstyledButton>
                <Checkbox
                  size="xs"
                  checked={allInGroupSelected}
                  indeterminate={partialInGroup}
                  onChange={() => onToggleResource(resource, codes)}
                  aria-label={`Выбрать все в ${resource}`}
                />
              </Group>
              <Collapse expanded={isExpanded}>
                <SimpleGrid cols={2} spacing="xs" verticalSpacing={4} mt="xs">
                  {perms.map((p) => (
                    <Checkbox
                      key={p.code}
                      label={p.name}
                      size="xs"
                      checked={selectedPerms.includes(p.code)}
                      onChange={() => onTogglePermission(p.code)}
                    />
                  ))}
                </SimpleGrid>
              </Collapse>
            </Paper>
          );
        })}
      </Stack>
    </ScrollArea.Autosize>
  );
}
