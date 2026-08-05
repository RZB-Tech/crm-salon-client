import React from 'react';
import { Button, Group } from '@mantine/core';
import { Package, Plus, Scissors } from '@phosphor-icons/react';
import { formatPrice } from '@/shared/lib/format';
import {
  calcServicesTotal,
  isLineFilled,
  type AppointmentFormValues,
  type MaterialOption,
  type ServiceOption,
} from '../../lib/appointmentForm';
import { ServiceLineRow } from './ServiceLineRow';
import { useServiceLineHandlers } from './useServiceLineHandlers';
import styles from './appointment-form-modal.module.css';

interface ServiceLinesTableProps {
  values: AppointmentFormValues;
  serviceOptions: ServiceOption[];
  materialOptions: MaterialOption[];
  onChange: (values: AppointmentFormValues) => void;
  readOnly?: boolean;
}

export const ServiceLinesTable: React.FC<ServiceLinesTableProps> = ({
  values,
  serviceOptions,
  materialOptions,
  onChange,
  readOnly = false,
}) => {
  const total = React.useMemo(() => calcServicesTotal(values.services), [values.services]);
  const filledCount = values.services.filter(isLineFilled).length;

  const {
    updateLine,
    handleKindChange,
    handleServiceSelect,
    handleMaterialSelect,
    handleQuantityChange,
    handleRemove,
    handleAdd,
  } = useServiceLineHandlers({ values, serviceOptions, materialOptions, onChange });

  const countLabel =
    filledCount === 0
      ? 'Добавьте услуги или товары'
      : filledCount === 1
        ? '1 позиция'
        : filledCount < 5
          ? `${filledCount} позиции`
          : `${filledCount} позиций`;

  return (
    <div className={styles.sectionCard}>
      <div className={styles.servicesHeader}>
        <div>
          <p className={styles.sectionTitle}>Состав визита</p>
          <p className={styles.sectionHint} style={{ margin: 0 }}>
            {countLabel}
          </p>
        </div>
        {!readOnly && (
          <Group gap={6}>
            <Button
              variant="light"
              color="sage"
              size="xs"
              radius="xl"
              leftSection={<Plus size={13} weight="bold" />}
              rightSection={<Scissors size={14} />}
              onClick={() => handleAdd('service')}
              disabled={!values.employeeId}
            >
              Услуга
            </Button>
            <Button
              variant="light"
              color="sage"
              size="xs"
              radius="xl"
              leftSection={<Plus size={13} weight="bold" />}
              rightSection={<Package size={14} />}
              onClick={() => handleAdd('material')}
              disabled={!values.employeeId}
            >
              Товар
            </Button>
          </Group>
        )}
      </div>

      {!values.employeeId && (
        <div className={styles.emptyLines}>Сначала выберите сотрудника — появятся его услуги</div>
      )}

      {values.employeeId && (
        <div className={styles.lineList}>
          {values.services.map((line) => (
            <ServiceLineRow
              key={line.key}
              line={line}
              serviceOptions={serviceOptions}
              materialOptions={materialOptions}
              readOnly={readOnly}
              canRemove={!(values.services.length === 1 && !isLineFilled(line))}
              onKindChange={handleKindChange}
              onServiceSelect={handleServiceSelect}
              onMaterialSelect={handleMaterialSelect}
              onQuantityChange={handleQuantityChange}
              onPriceChange={(key, price) => updateLine(key, { price })}
              onReasonChange={(key, reason) => updateLine(key, { priceChangedReason: reason })}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      <div className={styles.totalBar}>
        <span className={styles.totalLabel}>Итого</span>
        <span className={styles.totalValue}>{formatPrice(total)}</span>
      </div>
    </div>
  );
};
