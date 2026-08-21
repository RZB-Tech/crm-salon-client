import React from 'react';
import { ActionIcon, Table, Text } from '@mantine/core';
import { ArchiveIcon } from '@phosphor-icons/react';
import type { Specialization } from '@/shared/api/types';
import { useI18n } from '@/shared/lib/i18n';
import { listPageStyles } from '@/shared/ui';

interface SpecializationsTableProps {
  items: Specialization[];
  onEdit: (spec: Specialization) => void;
  onArchive: (specId: number) => void;
}

export const SpecializationsTable: React.FC<SpecializationsTableProps> = ({
  items,
  onEdit,
  onArchive,
}) => {
  const { t } = useI18n();
  return (
    <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th className={listPageStyles.headCell}>{t('common.name')}</Table.Th>
          <Table.Th className={listPageStyles.headCell} w={48} />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={2}>
              <Text size="sm" c="dimmed" ta="center" py="xl">
                {t('settings.empty')}
              </Text>
            </Table.Td>
          </Table.Tr>
        ) : (
          items.map((spec) => (
            <Table.Tr
              key={spec.id}
              className={`${listPageStyles.row} ${listPageStyles.rowClickable}`}
              onClick={() => onEdit(spec)}
            >
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" c="#484848">
                  {spec.name}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <ActionIcon
                  variant="subtle"
                  color="orange"
                  size="sm"
                  aria-label={t('common.archive')}
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive(spec.id);
                  }}
                >
                  <ArchiveIcon size={18} />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          ))
        )}
      </Table.Tbody>
    </Table>
  );
};
