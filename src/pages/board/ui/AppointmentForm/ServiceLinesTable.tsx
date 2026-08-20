import React from 'react';
import { formatPrice } from '@/shared/lib/format';
import type { Promotion } from '@/shared/api/types';
import {
  calcServicesTotal,
  isLineFilled,
  type AppointmentFormValues,
  type MaterialOption,
  type ServiceOption,
} from '../../lib/appointmentForm';
import { ServiceLineRow } from './ServiceLineRow';
import { useServiceLineHandlers } from './useServiceLineHandlers';
import { VisitAddButton } from './VisitAddButton';
import styles from './appointment-form-modal.module.css';

interface ServiceLinesTableProps {
  values: AppointmentFormValues;
  serviceOptions: ServiceOption[];
  materialOptions: MaterialOption[];
  promotions: Promotion[];
  onChange: (values: AppointmentFormValues) => void;
  readOnly?: boolean;
}

export const ServiceLinesTable: React.FC<ServiceLinesTableProps> = ({
  values,
  serviceOptions,
  materialOptions,
  promotions,
  onChange,
  readOnly = false,
}) => {
  const total = React.useMemo(
    () => calcServicesTotal(values.services, promotions),
    [values.services, promotions],
  );

  const {
    updateLine,
    handleServiceSelect,
    handleMaterialSelect,
    handleQuantityChange,
    handleRemove,
    handleAdd,
  } = useServiceLineHandlers({ values, serviceOptions, materialOptions, onChange });

  const hasEmployee = Boolean(values.employeeId);

  return (
    <div className={styles.visitBlock}>
      <div className={styles.visitHeader}>
        <div className={styles.visitHeading}>
          <p className={styles.visitTitle}>Детали визита</p>
          <p className={styles.sectionHint}>Добавьте услуги или товары</p>
        </div>
        {!readOnly && (
          <div className={styles.visitActions}>
            <VisitAddButton
              label="Услуга"
              onClick={() => handleAdd('service')}
              disabled={!hasEmployee}
            />
            <VisitAddButton
              label="Товар"
              onClick={() => handleAdd('material')}
              disabled={!hasEmployee}
            />
          </div>
        )}
      </div>

      {!hasEmployee ? (
        <div className={styles.sectionCard}>
          <div className={styles.emptyLines}>Выберите сначала сотрудника</div>
        </div>
      ) : (
        <>
          <div className={styles.lineList}>
            {values.services.map((line) => (
              <ServiceLineRow
                key={line.key}
                line={line}
                serviceOptions={serviceOptions}
                materialOptions={materialOptions}
                promotions={promotions}
                readOnly={readOnly}
                canRemove={!(values.services.length === 1 && !isLineFilled(line))}
                onServiceSelect={handleServiceSelect}
                onMaterialSelect={handleMaterialSelect}
                onQuantityChange={handleQuantityChange}
                onPriceChange={(key, price) => updateLine(key, { price })}
                onReasonChange={(key, reason) => updateLine(key, { priceChangedReason: reason })}
                onRemove={handleRemove}
              />
            ))}
          </div>
          <div className={styles.totalBar}>
            <span>Итого:</span>
            <span>{formatPrice(total)}</span>
          </div>
        </>
      )}
    </div>
  );
};
