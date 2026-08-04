import React from 'react';
import {
  ActionIcon,
  Button,
  Center,
  Group,
  NumberInput,
  SegmentedControl,
  Select,
  Textarea,
  Tooltip,
} from '@mantine/core';
import { Package, Plus, Scissors, TrashIcon } from '@phosphor-icons/react';
import { formatPrice } from '@/shared/lib/format';
import {
  applyServiceDuration,
  calcServicesTotal,
  createEmptyServiceLine,
  isLineFilled,
  isPriceChanged,
  type AppointmentFormValues,
  type LineKind,
  type MaterialOption,
  type ServiceOption,
} from '../../lib/appointmentForm';
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

  const updateLine = React.useCallback(
    (key: string, patch: Partial<(typeof values.services)[number]>) => {
      const nextServices = values.services.map((line) =>
        line.key === key ? { ...line, ...patch } : line,
      );
      onChange({ ...values, services: nextServices });
    },
    [onChange, values],
  );

  const handleKindChange = React.useCallback(
    (key: string, kind: LineKind) => {
      const nextServices = values.services.map((line) =>
        line.key === key
          ? {
              ...line,
              kind,
              serviceId: null,
              materialId: null,
              price: 0,
              catalogPrice: 0,
              priceChangedReason: '',
            }
          : line,
      );
      onChange({ ...values, services: nextServices });
    },
    [onChange, values],
  );

  const handleServiceSelect = React.useCallback(
    (key: string, serviceId: string | null) => {
      const option = serviceOptions.find((item) => item.value === serviceId);
      const nextServices = values.services.map((line) =>
        line.key === key
          ? {
              ...line,
              serviceId,
              materialId: null,
              price: option?.price ?? line.price,
              catalogPrice: option?.price ?? 0,
              priceChangedReason: '',
            }
          : line,
      );
      onChange(applyServiceDuration({ ...values, services: nextServices }, serviceOptions));
    },
    [onChange, serviceOptions, values],
  );

  const handleMaterialSelect = React.useCallback(
    (key: string, materialId: string | null) => {
      const option = materialOptions.find((item) => item.value === materialId);
      const nextServices = values.services.map((line) =>
        line.key === key
          ? {
              ...line,
              materialId,
              serviceId: null,
              price: option?.price ?? line.price,
              catalogPrice: option?.price ?? 0,
              priceChangedReason: '',
            }
          : line,
      );
      onChange({ ...values, services: nextServices });
    },
    [materialOptions, onChange, values],
  );

  const handleQuantityChange = React.useCallback(
    (key: string, quantity: number) => {
      const nextServices = values.services.map((line) =>
        line.key === key ? { ...line, quantity } : line,
      );
      onChange(applyServiceDuration({ ...values, services: nextServices }, serviceOptions));
    },
    [onChange, serviceOptions, values],
  );

  const handleRemove = React.useCallback(
    (key: string) => {
      const next = values.services.filter((line) => line.key !== key);
      const nextServices = next.length > 0 ? next : [createEmptyServiceLine()];
      onChange(applyServiceDuration({ ...values, services: nextServices }, serviceOptions));
    },
    [onChange, serviceOptions, values],
  );

  const handleAdd = React.useCallback(
    (kind: LineKind = 'service') => {
      onChange({ ...values, services: [...values.services, createEmptyServiceLine(kind)] });
    },
    [onChange, values],
  );

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
          {values.services.map((line) => {
            const changed = isPriceChanged(line);
            const showExtras =
              changed || Boolean(line.priceChangedReason.trim()) || !readOnly;

            return (
              <div
                key={line.key}
                className={`${styles.lineCard} ${changed ? styles.lineCardChanged : ''}`}
              >
                <div className={styles.lineTop}>
                  <SegmentedControl
                    size="sm"
                    radius="md"
                    className={styles.kindToggle}
                    data={[
                      {
                        value: 'service',
                        label: (
                          <Tooltip label="Услуга" openDelay={300}>
                            <Center h={20}>
                              <Scissors size={16} />
                            </Center>
                          </Tooltip>
                        ),
                      },
                      {
                        value: 'material',
                        label: (
                          <Tooltip label="Товар" openDelay={300}>
                            <Center h={20}>
                              <Package size={16} />
                            </Center>
                          </Tooltip>
                        ),
                      },
                    ]}
                    value={line.kind}
                    onChange={(value) => handleKindChange(line.key, value as LineKind)}
                    disabled={readOnly}
                  />

                  {line.kind === 'service' ? (
                    <Select
                      searchable
                      placeholder="Выберите услугу"
                      data={serviceOptions}
                      value={line.serviceId}
                      onChange={(value) => handleServiceSelect(line.key, value)}
                      nothingFoundMessage="Нет услуг у сотрудника"
                      disabled={readOnly}
                    />
                  ) : (
                    <Select
                      searchable
                      placeholder="Выберите товар"
                      data={materialOptions}
                      value={line.materialId}
                      onChange={(value) => handleMaterialSelect(line.key, value)}
                      nothingFoundMessage="Нет товаров"
                      disabled={readOnly}
                    />
                  )}

                  {!readOnly && (
                    <Tooltip label="Удалить позицию" openDelay={300}>
                      <ActionIcon
                        variant="light"
                        color="red"
                        size="lg"
                        radius="md"
                        aria-label="Удалить позицию"
                        onClick={() => handleRemove(line.key)}
                        disabled={values.services.length === 1 && !isLineFilled(line)}
                      >
                        <TrashIcon size={16} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </div>

                <div className={styles.lineMetrics} style={{ marginTop: 8 }}>
                  <NumberInput
                    label="Кол-во"
                    min={1}
                    value={line.quantity}
                    onChange={(value) => handleQuantityChange(line.key, Number(value) || 1)}
                    disabled={readOnly}
                  />
                  <NumberInput
                    label="Цена"
                    min={0}
                    value={line.price}
                    onChange={(value) => updateLine(line.key, { price: Number(value) || 0 })}
                    thousandSeparator=" "
                    suffix=" сум"
                    disabled={readOnly}
                  />
                </div>

                {isLineFilled(line) && (
                  <div className={styles.lineSubtotal}>
                    Сумма позиции: {formatPrice(line.quantity * line.price)}
                    {changed && ' · цена изменена'}
                  </div>
                )}

                {showExtras && (
                  <div className={styles.lineExtras}>
                    <Textarea
                      label="Заметка"
                      placeholder={changed ? 'Обязательно, минимум 5 символов' : 'Необязательно'}
                      required={changed}
                      minRows={1}
                      autosize
                      value={line.priceChangedReason}
                      onChange={(event) =>
                        updateLine(line.key, {
                          priceChangedReason: event.currentTarget.value,
                        })
                      }
                      disabled={readOnly}
                      error={
                        changed &&
                        line.priceChangedReason.trim().length > 0 &&
                        line.priceChangedReason.trim().length < 5
                          ? 'Слишком коротко'
                          : undefined
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.totalBar}>
        <span className={styles.totalLabel}>Итого</span>
        <span className={styles.totalValue}>{formatPrice(total)}</span>
      </div>
    </div>
  );
};
