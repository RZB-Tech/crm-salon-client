import React from 'react';
import { ActionIcon, Select, Tooltip } from '@mantine/core';
import { TrashIcon } from '@phosphor-icons/react';
import type { Promotion } from '@/shared/api/types';
import {
  isPriceChanged,
  type AppointmentServiceLine,
  type LineKind,
  type MaterialOption,
  type ServiceOption,
} from '../../lib/appointmentForm';
import { ServiceLineKindToggle } from './ServiceLineKindToggle';
import { ServiceLineMetrics } from './ServiceLineMetrics';
import styles from './appointment-form-modal.module.css';

interface ServiceLineRowProps {
  line: AppointmentServiceLine;
  serviceOptions: ServiceOption[];
  materialOptions: MaterialOption[];
  promotions: Promotion[];
  readOnly: boolean;
  canRemove: boolean;
  onKindChange: (key: string, kind: LineKind) => void;
  onServiceSelect: (key: string, serviceId: string | null) => void;
  onMaterialSelect: (key: string, materialId: string | null) => void;
  onQuantityChange: (key: string, quantity: number) => void;
  onPriceChange: (key: string, price: number) => void;
  onReasonChange: (key: string, reason: string) => void;
  onRemove: (key: string) => void;
}

export const ServiceLineRow: React.FC<ServiceLineRowProps> = ({
  line,
  serviceOptions,
  materialOptions,
  promotions,
  readOnly,
  canRemove,
  onKindChange,
  onServiceSelect,
  onMaterialSelect,
  onQuantityChange,
  onPriceChange,
  onReasonChange,
  onRemove,
}) => {
  const changed = isPriceChanged(line);
  const isService = line.kind === 'service';

  return (
    <div className={`${styles.lineCard} ${changed ? styles.lineCardChanged : ''}`}>
      <div className={styles.lineTop}>
        <ServiceLineKindToggle
          kind={line.kind}
          readOnly={readOnly}
          onKindChange={(kind) => onKindChange(line.key, kind)}
        />
        {!readOnly && (
          <Tooltip label="Удалить позицию" openDelay={300}>
            <ActionIcon
              className={styles.lineTrash}
              variant="outline"
              color="gray"
              size={32}
              radius="md"
              aria-label="Удалить позицию"
              onClick={() => onRemove(line.key)}
              disabled={!canRemove}
            >
              <TrashIcon size={16} />
            </ActionIcon>
          </Tooltip>
        )}
      </div>

      {isService ? (
        <Select
          label="Услуга"
          searchable
          placeholder="Выберите услугу"
          data={serviceOptions}
          value={line.serviceId}
          onChange={(value) => onServiceSelect(line.key, value)}
          nothingFoundMessage="Нет услуг у сотрудника"
          disabled={readOnly}
        />
      ) : (
        <Select
          label="Товар"
          searchable
          placeholder="Выберите товар"
          data={materialOptions}
          value={line.materialId}
          onChange={(value) => onMaterialSelect(line.key, value)}
          nothingFoundMessage="Нет товаров"
          disabled={readOnly}
        />
      )}

      <ServiceLineMetrics
        line={line}
        promotions={promotions}
        readOnly={readOnly}
        onQuantityChange={(quantity) => onQuantityChange(line.key, quantity)}
        onPriceChange={(price) => onPriceChange(line.key, price)}
        onReasonChange={(reason) => onReasonChange(line.key, reason)}
      />
    </div>
  );
};
