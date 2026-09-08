import React from 'react';
import { Table, Text } from '@mantine/core';
import { formatPrice } from '@/shared/lib/format';
import { DataTable, DataTableRow, type DataTableColumn } from '@/shared/ui';
import { shareOf } from '../lib/analyticsHelpers';
import { AnalyticsSection } from './AnalyticsSection';
import styles from './analytics.module.css';

export interface AnalyticsRankedRow {
  id: number;
  name: string;
  revenue: number;
  metrics: React.ReactNode[];
}

interface AnalyticsRankedTableProps {
  title: string;
  loading: boolean;
  error: boolean;
  columns: DataTableColumn[];
  rows: AnalyticsRankedRow[];
  emptyMessage: string;
}

export const AnalyticsRankedTable: React.FC<AnalyticsRankedTableProps> = ({
  title,
  loading,
  error,
  columns,
  rows,
  emptyMessage,
}) => {
  const maxRevenue = rows[0]?.revenue ?? 0;

  return (
    <AnalyticsSection title={title} loading={loading} error={error}>
      <div className={styles.tableWrap}>
        <DataTable compact maxHeight={360} columns={columns} isEmpty={rows.length === 0} emptyMessage={emptyMessage}>
          {rows.map((row) => (
            <DataTableRow key={row.id}>
              <Table.Td>
                <Text size="sm" fw={600}>
                  {row.name}
                </Text>
                <div className={styles.shareTrack}>
                  <div className={styles.shareBar} style={{ width: `${shareOf(row.revenue, maxRevenue)}%` }} />
                </div>
              </Table.Td>
              {row.metrics.map((metric, index) => (
                <Table.Td key={`${row.id}-${index}`} ta="right">
                  {metric}
                </Table.Td>
              ))}
              <Table.Td ta="right">
                <Text size="sm" fw={600}>
                  {formatPrice(row.revenue)}
                </Text>
              </Table.Td>
            </DataTableRow>
          ))}
        </DataTable>
      </div>
    </AnalyticsSection>
  );
};
