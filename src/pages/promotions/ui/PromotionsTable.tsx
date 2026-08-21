import React from 'react';
import { ActionIcon, Badge, Table, Text } from '@mantine/core';
import { ArchiveIcon, ArrowCounterClockwiseIcon } from '@phosphor-icons/react';
import type { Promotion } from '@/shared/api/types';
import { listPageStyles, SortableTh } from '@/shared/ui';
import { t, useI18n } from '@/shared/lib/i18n';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import {
  formatDiscountLabel,
  formatPromotionPeriod,
  getPromotionStatus,
  PROMOTION_STATUS_COLORS,
  PROMOTION_STATUS_LABELS,
} from '../lib/promotionHelpers';

interface PromotionsTableProps extends TableSortProps {
  items: Promotion[];
  showArchived: boolean;
  serviceNameMap: Map<number, string>;
  materialNameMap: Map<number, string>;
  onEdit: (promo: Promotion) => void;
  onArchive: (event: React.MouseEvent, promoId: number) => void;
  onRestore: (event: React.MouseEvent, promoId: number) => void;
}

const targetLabel = (
  promo: Promotion,
  serviceNameMap: Map<number, string>,
  materialNameMap: Map<number, string>,
): string => {
  if (promo.service_id != null) {
    return serviceNameMap.get(promo.service_id) ?? t('promotions.serviceNamed', { id: promo.service_id });
  }
  if (promo.material_id != null) {
    return materialNameMap.get(promo.material_id) ?? t('promotions.materialNamed', { id: promo.material_id });
  }
  return t('common.dash');
};

export const PromotionsTable: React.FC<PromotionsTableProps> = ({
  items,
  showArchived,
  sort,
  onSort,
  serviceNameMap,
  materialNameMap,
  onEdit,
  onArchive,
  onRestore,
}) => {
  const { t } = useI18n();
  const { hasPermission } = useAccess();
  const canUpdate = !showArchived && hasPermission(PermissionCode.PROMOTION_UPDATE);
  const canManage = hasPermission(PermissionCode.PROMOTION_MANAGE);

  return (
    <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
      <Table.Thead>
        <Table.Tr>
          <SortableTh column="name" sort={sort} onSort={onSort}>
            {t('common.name')}
          </SortableTh>
          <Table.Th className={listPageStyles.headCell}>{t('promotions.target')}</Table.Th>
          <SortableTh column="discount" sort={sort} onSort={onSort} w={160}>
            {t('form.discount')}
          </SortableTh>
          <SortableTh column="period" sort={sort} onSort={onSort} w={220}>
            {t('form.period')}
          </SortableTh>
          <SortableTh column="status" sort={sort} onSort={onSort} w={140}>
            {t('common.status')}
          </SortableTh>
          <Table.Th className={listPageStyles.headCell} w={48} />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={6}>
              <Text size="sm" c="dimmed" ta="center" py="xl">
                {t('promotions.notFound')}
              </Text>
            </Table.Td>
          </Table.Tr>
        ) : (
          items.map((promo) => {
            const status = getPromotionStatus(promo);
            return (
              <Table.Tr
                key={promo.id}
                className={`${listPageStyles.row} ${canUpdate ? listPageStyles.rowClickable : ''}`}
                onClick={canUpdate ? () => onEdit(promo) : undefined}
              >
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" fw={400} c="#484848">
                    {promo.name}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" c="rgba(72,72,72,0.7)">
                    {promo.service_id != null ? t('form.service') : t('form.product')}
                    {' · '}
                    {targetLabel(promo, serviceNameMap, materialNameMap)}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" fw={600}>
                    {formatDiscountLabel(promo)}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" c="rgba(72,72,72,0.5)">
                    {formatPromotionPeriod(promo)}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Badge variant="light" color={PROMOTION_STATUS_COLORS[status]} radius="sm">
                    {PROMOTION_STATUS_LABELS[status]}
                  </Badge>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  {canManage &&
                    (showArchived ? (
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        size="sm"
                        aria-label={t('common.restore')}
                        onClick={(event) => onRestore(event, promo.id)}
                      >
                        <ArrowCounterClockwiseIcon size={18} />
                      </ActionIcon>
                    ) : (
                      <ActionIcon
                        variant="subtle"
                        color="orange"
                        size="sm"
                        aria-label={t('common.archive')}
                        onClick={(event) => onArchive(event, promo.id)}
                      >
                        <ArchiveIcon size={18} />
                      </ActionIcon>
                    ))}
                </Table.Td>
              </Table.Tr>
            );
          })
        )}
      </Table.Tbody>
    </Table>
  );
};
