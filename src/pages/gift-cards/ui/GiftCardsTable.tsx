import React from 'react';
import { ActionIcon, Badge, Group, Table, Text, Tooltip } from '@mantine/core';
import { ArchiveIcon, ArrowCounterClockwiseIcon, XIcon } from '@phosphor-icons/react';
import type { GiftCard } from '@/shared/api/types';
import { formatDate, formatPrice, GIFT_CARD_STATUS_LABELS } from '@/shared/lib/format';
import { listPageStyles, SortableTh } from '@/shared/ui';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import {
  canCancelGiftCard,
  GIFT_CARD_STATUS_COLORS,
  getGiftCardViewStatus,
} from '../lib/giftCardHelpers';

interface GiftCardsTableProps extends TableSortProps {
  items: GiftCard[];
  showArchived: boolean;
  clientNameMap: Map<number, string>;
  onEdit: (card: GiftCard) => void;
  onArchive: (event: React.MouseEvent, cardId: number) => void;
  onRestore: (event: React.MouseEvent, cardId: number) => void;
  onCancel: (event: React.MouseEvent, cardId: number) => void;
}

export const GiftCardsTable: React.FC<GiftCardsTableProps> = ({
  items,
  showArchived,
  sort,
  onSort,
  clientNameMap,
  onEdit,
  onArchive,
  onRestore,
  onCancel,
}) => {
  const { hasPermission } = useAccess();
  const canUpdate = !showArchived && hasPermission(PermissionCode.GIFT_CARD_UPDATE);
  const canManage = hasPermission(PermissionCode.GIFT_CARD_MANAGE);

  return (
    <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
      <Table.Thead>
        <Table.Tr>
          <SortableTh column="code" sort={sort} onSort={onSort}>
            Код
          </SortableTh>
          <Table.Th className={listPageStyles.headCell}>Клиент</Table.Th>
          <SortableTh column="amount" sort={sort} onSort={onSort} w={180}>
            Остаток
          </SortableTh>
          <SortableTh column="issued" sort={sort} onSort={onSort} w={140}>
            Выдан
          </SortableTh>
          <SortableTh column="status" sort={sort} onSort={onSort} w={140}>
            Статус
          </SortableTh>
          <Table.Th className={listPageStyles.headCell} w={88} />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={6}>
              <Text size="sm" c="dimmed" ta="center" py="xl">
                Купоны не найдены
              </Text>
            </Table.Td>
          </Table.Tr>
        ) : (
          items.map((card) => {
            const status = getGiftCardViewStatus(card);
            return (
              <Table.Tr
                key={card.id}
                className={`${listPageStyles.row} ${canUpdate ? listPageStyles.rowClickable : ''}`}
                onClick={canUpdate ? () => onEdit(card) : undefined}
              >
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" fw={600} c="#484848">
                    {card.code}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" c="rgba(72,72,72,0.7)">
                    {card.client_id != null
                      ? (clientNameMap.get(card.client_id) ?? `Клиент #${card.client_id}`)
                      : 'Любой клиент'}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" fw={600}>
                    {formatPrice(card.remain_amount)}
                  </Text>
                  <Text size="xs" c="dimmed">
                    из {formatPrice(card.initial_amount)}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" c="rgba(72,72,72,0.5)">
                    {formatDate(card.issue_date)}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Badge variant="light" color={GIFT_CARD_STATUS_COLORS[status]} radius="sm">
                    {GIFT_CARD_STATUS_LABELS[status] ?? status}
                  </Badge>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Group gap={4} wrap="nowrap" justify="flex-end">
                    {canUpdate && canCancelGiftCard(card) && (
                      <Tooltip label="Отменить">
                        <ActionIcon
                          variant="subtle"
                          color="orange"
                          size="sm"
                          aria-label="Отменить"
                          onClick={(event) => onCancel(event, card.id)}
                        >
                          <XIcon size={16} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                    {canManage &&
                      (showArchived ? (
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          size="sm"
                          aria-label="Восстановить"
                          onClick={(event) => onRestore(event, card.id)}
                        >
                          <ArrowCounterClockwiseIcon size={18} />
                        </ActionIcon>
                      ) : (
                        <ActionIcon
                          variant="subtle"
                          color="orange"
                          size="sm"
                          aria-label="Архивировать"
                          onClick={(event) => onArchive(event, card.id)}
                        >
                          <ArchiveIcon size={18} />
                        </ActionIcon>
                      ))}
                  </Group>
                </Table.Td>
              </Table.Tr>
            );
          })
        )}
      </Table.Tbody>
    </Table>
  );
};
