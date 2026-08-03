import React from 'react';
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Modal,
  SegmentedControl,
  Select,
  Tabs,
  Text,
  Textarea,
} from '@mantine/core';
import { DateInput, TimePicker } from '@mantine/dates';
import {
  Archive,
  ArrowCounterClockwise,
  CalendarPlus,
  CheckCircle,
  Phone,
  Prohibit,
  X,
} from '@phosphor-icons/react';
import type { Appointment, AppointmentStatus, Client, Receipt } from '@/shared/api/types';
import {
  APPOINTMENT_CANCELLED_REASON_LABELS,
  APPOINTMENT_STATUS_OPTIONS,
  formatPrice,
  getClientFullName,
} from '@/shared/lib/format';
import { PayAppointmentPanel } from '@/shared/ui/PayAppointmentPanel';
import {
  applyStartTimeChange,
  calcServicesTotal,
  calcTotalEstimatedTime,
  createEmptyServiceLine,
  isAppointmentFormValid,
  type AppointmentFormValues,
  type MaterialOption,
  type ServiceOption,
} from '../../lib/appointmentForm';
import { QuickClientForm } from './QuickClientForm';
import { ServiceLinesTable } from './ServiceLinesTable';
import { AppointmentAuditSection } from './AppointmentAuditSection';
import styles from './appointment-form-modal.module.css';

interface AppointmentFormModalProps {
  opened: boolean;
  mode: 'create' | 'edit';
  loading?: boolean;
  paid?: boolean;
  cancelled?: boolean;
  archived?: boolean;
  structureLocked?: boolean;
  activeReceipt?: Receipt | null;
  appointment?: Appointment | null;
  values: AppointmentFormValues;
  clientOptions: { value: string; label: string }[];
  clients: Client[];
  employeeOptions: { value: string; label: string }[];
  serviceOptions: ServiceOption[];
  materialOptions: MaterialOption[];
  onChange: (values: AppointmentFormValues) => void;
  onClose: () => void;
  onSubmit: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
  onCancel?: () => void;
}

export type { AppointmentFormValues };

export const AppointmentFormModal: React.FC<AppointmentFormModalProps> = ({
  opened,
  mode,
  loading = false,
  paid = false,
  cancelled = false,
  archived = false,
  structureLocked = false,
  activeReceipt = null,
  appointment = null,
  values,
  clientOptions,
  clients,
  employeeOptions,
  serviceOptions,
  materialOptions,
  onChange,
  onClose,
  onSubmit,
  onDelete,
  onRestore,
  onCancel,
}) => {
  const [tab, setTab] = React.useState<string>('main');
  const [showQuickClient, setShowQuickClient] = React.useState(false);
  /* Пересоздаём содержимое после анимации открытия: SegmentedControl
     измеряет индикатор во время scale-трансформации и встаёт криво */
  const [renderKey, setRenderKey] = React.useState(0);

  React.useEffect(() => {
    if (opened) {
      setTab('main');
      setShowQuickClient(false);
    }
  }, [opened, mode, appointment?.id]);

  const selectedClient = React.useMemo(
    () => clients.find((client) => String(client.id) === values.clientId),
    [clients, values.clientId],
  );

  const total = React.useMemo(() => calcServicesTotal(values.services), [values.services]);
  const isValid = isAppointmentFormValid(values);
  const fieldsLocked = cancelled || archived || structureLocked;

  const handleEmployeeChange = React.useCallback(
    (employeeId: string | null) => {
      onChange({ ...values, employeeId, services: [createEmptyServiceLine()] });
    },
    [onChange, values],
  );

  const title =
    mode === 'create'
      ? 'Новая запись'
      : selectedClient
        ? getClientFullName(selectedClient)
        : 'Запись клиента';

  const subtitle =
    mode === 'create'
      ? 'Клиент, время и состав визита'
      : [values.date, `${values.startTime}–${values.endTime}`].filter(Boolean).join(' · ');

  const avatarInitials = React.useMemo(() => {
    if (!selectedClient) return null;
    const initials = [selectedClient.firstname?.[0], selectedClient.lastname?.[0]]
      .filter(Boolean)
      .join('')
      .toUpperCase();
    return initials || null;
  }, [selectedClient]);

  const mainForm = (
    <>
      {structureLocked && (
        <Alert
          className={styles.lockAlert}
          color="yellow"
          variant="light"
          title="Состав заблокирован чеком"
        >
          Чек{activeReceipt ? ` #${activeReceipt.id}` : ''} активен. Отмените его во вкладке
          «Оплата», чтобы менять клиента, время или услуги.
        </Alert>
      )}

      <div className={styles.sectionCard}>
        <p className={styles.sectionTitle}>Визит</p>

        {mode === 'edit' && !cancelled && (
          <div className={styles.statusBlock}>
            <Text size="xs" c="dimmed" mb={6}>
              Статус
            </Text>
            <SegmentedControl
              fullWidth
              data={APPOINTMENT_STATUS_OPTIONS}
              value={values.status === 'cancelled' ? 'awaiting' : values.status}
              onChange={(value) =>
                onChange({
                  ...values,
                  status: value as AppointmentStatus,
                })
              }
              disabled={archived}
            />
          </div>
        )}

        <div className={styles.clientRow}>
          <Select
            label="Клиент"
            required
            searchable
            data={clientOptions}
            value={values.clientId}
            onChange={(value) => onChange({ ...values, clientId: value })}
            className={styles.clientSelect}
            disabled={fieldsLocked}
            placeholder="Найти клиента"
          />
          {!fieldsLocked && !showQuickClient && (
            <Button
              variant="light"
              color="sage"
              size="sm"
              onClick={() => setShowQuickClient(true)}
            >
              + Новый
            </Button>
          )}
        </div>

        {!fieldsLocked && showQuickClient && (
          <QuickClientForm
            onCreated={(id) => {
              onChange({ ...values, clientId: id });
              setShowQuickClient(false);
            }}
            onCancel={() => setShowQuickClient(false)}
          />
        )}

        {selectedClient?.phone && (
          <div className={styles.clientMeta}>
            <Phone size={14} color="var(--mantine-color-sage-7)" />
            <span className={styles.clientPhone}>{selectedClient.phone}</span>
          </div>
        )}

        <div className={styles.scheduleGrid} style={{ marginTop: 12 }}>
          <DateInput
            label="Дата"
            required
            value={values.date || null}
            onChange={(value) => onChange({ ...values, date: value ?? '' })}
            disabled={fieldsLocked}
          />
          <TimePicker
            label="Начало"
            required
            minutesStep={15}
            value={values.startTime}
            onChange={(value) =>
              onChange(
                applyStartTimeChange(values, value, calcTotalEstimatedTime(values.services, serviceOptions)),
              )
            }
            disabled={fieldsLocked}
          />
          <TimePicker
            label="Конец"
            required
            minutesStep={15}
            value={values.endTime}
            onChange={(value) => onChange({ ...values, endTime: value })}
            disabled={fieldsLocked}
          />
        </div>

        <Select
          label="Сотрудник"
          required
          searchable
          mt="sm"
          data={employeeOptions}
          value={values.employeeId}
          onChange={handleEmployeeChange}
          disabled={fieldsLocked}
          placeholder="Кто принимает"
        />
      </div>

      <ServiceLinesTable
        values={values}
        serviceOptions={serviceOptions}
        materialOptions={materialOptions}
        onChange={onChange}
        readOnly={fieldsLocked}
      />

      <div className={styles.sectionCardMuted}>
        <p className={styles.sectionTitleMuted}>Комментарий</p>
        <Textarea
          placeholder="Пожелания клиента, детали визита…"
          minRows={2}
          autosize
          value={values.notes}
          onChange={(event) => onChange({ ...values, notes: event.currentTarget.value })}
          disabled={cancelled || archived}
        />
      </div>
    </>
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      title={null}
      radius="lg"
      size="lg"
      padding={0}
      transitionProps={{
        transition: 'pop',
        duration: 220,
        onEntered: () => setRenderKey((key) => key + 1),
      }}
    >
      <div className={styles.modalBody} key={renderKey}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerAvatar}>
              {avatarInitials ?? <CalendarPlus size={22} />}
            </div>
            <div className={styles.headerInfo}>
              <h2 className={styles.headerTitle}>{title}</h2>
              <div className={styles.headerSubtitle}>{subtitle}</div>
            </div>
            <div className={styles.headerSide}>
              {mode === 'edit' && (
                <Badge
                  size="lg"
                  variant="light"
                  color={paid ? 'teal' : 'orange'}
                  leftSection={paid ? <CheckCircle size={14} /> : undefined}
                >
                  {paid ? 'Оплачено' : 'Не оплачено'}
                </Badge>
              )}
              <ActionIcon
                variant="subtle"
                color="gray"
                size="lg"
                radius="xl"
                aria-label="Закрыть"
                onClick={onClose}
              >
                <X size={18} />
              </ActionIcon>
            </div>
          </div>

          {mode === 'edit' && (archived || cancelled || structureLocked) && (
            <div className={styles.badgeRow}>
              {archived && (
                <Badge color="gray" variant="light">
                  В архиве
                </Badge>
              )}
              {cancelled && (
                <Badge color="red" variant="light">
                  Отменена
                </Badge>
              )}
              {cancelled && appointment?.cancelled_reason && (
                <Badge color="gray" variant="outline">
                  {APPOINTMENT_CANCELLED_REASON_LABELS[appointment.cancelled_reason] ??
                    appointment.cancelled_reason}
                </Badge>
              )}
              {structureLocked && (
                <Badge color="yellow" variant="light">
                  Есть чек
                </Badge>
              )}
            </div>
          )}
        </header>

        <div className={styles.content}>
          {mode === 'edit' && appointment ? (
            <Tabs
              value={tab}
              onChange={(value) => setTab(value ?? 'main')}
              variant="pills"
              color="sage"
              radius="xl"
            >
              <Tabs.List className={styles.tabsList}>
                <Tabs.Tab value="main">Запись</Tabs.Tab>
                <Tabs.Tab value="payment">Оплата</Tabs.Tab>
                <Tabs.Tab value="history">История</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="main">{mainForm}</Tabs.Panel>
              <Tabs.Panel value="payment">
                <PayAppointmentPanel appointment={appointment} />
              </Tabs.Panel>
              <Tabs.Panel value="history">
                <AppointmentAuditSection appointment={appointment} />
              </Tabs.Panel>
            </Tabs>
          ) : (
            mainForm
          )}
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerMeta}>
            {mode === 'create' || tab === 'main' ? (
              <>
                <span className={styles.footerTotalLabel}>Сумма визита</span>
                <span className={styles.footerTotalValue}>{formatPrice(total)}</span>
              </>
            ) : (
              <Button variant="subtle" color="gray" size="compact-sm" onClick={onClose}>
                Закрыть
              </Button>
            )}
          </div>

          <div className={styles.footerActions}>
            {mode === 'edit' && tab === 'main' && (
              <div className={styles.dangerActions}>
                {archived && onRestore && (
                  <Button
                    variant="light"
                    color="teal"
                    size="sm"
                    leftSection={<ArrowCounterClockwise size={14} />}
                    onClick={onRestore}
                    loading={loading}
                  >
                    Восстановить
                  </Button>
                )}
                {!archived && onCancel && !cancelled && !paid && (
                  <Button
                    variant="subtle"
                    color="orange"
                    size="sm"
                    leftSection={<Prohibit size={14} />}
                    onClick={onCancel}
                    loading={loading}
                    disabled={structureLocked}
                  >
                    Отменить
                  </Button>
                )}
                {!archived && onDelete && (
                  <Button
                    variant="subtle"
                    color="red"
                    size="sm"
                    leftSection={<Archive size={14} />}
                    onClick={onDelete}
                    loading={loading}
                  >
                    В архив
                  </Button>
                )}
              </div>
            )}

            {mode === 'create' && (
              <Button variant="default" size="sm" onClick={onClose}>
                Отмена
              </Button>
            )}

            {(tab === 'main' || mode === 'create') && !cancelled && !archived && (
              <Button onClick={onSubmit} loading={loading} disabled={!isValid} size="sm">
                {mode === 'edit' ? 'Сохранить' : 'Создать запись'}
              </Button>
            )}
          </div>
        </footer>
      </div>
    </Modal>
  );
};
