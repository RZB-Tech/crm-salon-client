import React from 'react';
import { ActionIcon, Table, Text } from '@mantine/core';
import { ArchiveIcon, ArrowCounterClockwiseIcon } from '@phosphor-icons/react';
import type { Material } from '@/shared/api/types';
import { listPageStyles } from '@/shared/ui';
import { formatPrice, MEASUREMENT_UNIT_LABELS } from '@/shared/lib/format';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';

interface MaterialsTableProps {
  items: Material[];
  showArchived: boolean;
  onEdit: (material: Material) => void;
  onArchive: (event: React.MouseEvent, materialId: number) => void;
  onRestore: (event: React.MouseEvent, materialId: number) => void;
}

export const MaterialsTable: React.FC<MaterialsTableProps> = ({
  items,
  showArchived,
  onEdit,
  onArchive,
  onRestore,
}) => {
  const { hasPermission } = useAccess();
  const canUpdate = !showArchived && hasPermission(PermissionCode.MATERIAL_UPDATE);
  const canManage = hasPermission(PermissionCode.MATERIAL_MANAGE);

  return (
    <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th className={listPageStyles.headCell}>Артикул</Table.Th>
          <Table.Th className={listPageStyles.headCell}>Название</Table.Th>
          <Table.Th className={listPageStyles.headCell} w={200}>
            Кол-во
          </Table.Th>
          <Table.Th className={listPageStyles.headCell} w={200}>
            Цена продажи
          </Table.Th>
          <Table.Th className={listPageStyles.headCell} w={48} />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={5}>
              <Text size="sm" c="dimmed" ta="center" py="xl">
                Материалы не найдены
              </Text>
            </Table.Td>
          </Table.Tr>
        ) : (
          items.map((material) => (
            <Table.Tr
              key={material.id}
              className={`${listPageStyles.row} ${canUpdate ? listPageStyles.rowClickable : ''}`}
              onClick={canUpdate ? () => onEdit(material) : undefined}
            >
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" ff="monospace" c="rgba(72,72,72,0.4)">
                  {material.article}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" fw={400} c="#484848">
                  {material.name}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" fw={500} c="rgba(72,72,72,0.4)">
                  {material.quantity} {MEASUREMENT_UNIT_LABELS[material.measurement_unit]}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" fw={600} c="#484848">
                  {formatPrice(material.sell_price)}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                {canManage &&
                  (showArchived ? (
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      size="sm"
                      aria-label="Восстановить"
                      onClick={(e) => onRestore(e, material.id)}
                    >
                      <ArrowCounterClockwiseIcon size={18} />
                    </ActionIcon>
                  ) : (
                    <ActionIcon
                      variant="subtle"
                      color="orange"
                      size="sm"
                      aria-label="Архивировать"
                      onClick={(e) => onArchive(e, material.id)}
                    >
                      <ArchiveIcon size={18} />
                    </ActionIcon>
                  ))}
              </Table.Td>
            </Table.Tr>
          ))
        )}
      </Table.Tbody>
    </Table>
  );
};
