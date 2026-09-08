import React from 'react';
import { Button } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ArrowCounterClockwise, Prohibit } from '@phosphor-icons/react';
import type { PaymentFooterActions } from '@/shared/ui/PayAppointmentPanel';
import { FormModalFooter } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';

const MOBILE_QUERY = '(max-width: 47.99em)';

interface AppointmentFormFooterProps {
  mode: 'create' | 'edit';
  tab: string;
  isValid: boolean;
  loading: boolean;
  cancelled: boolean;
  archived: boolean;
  paid: boolean;
  structureLocked: boolean;
  paymentSubmit?: PaymentFooterActions | null;
  onClose: () => void;
  onSubmit: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
  onCancel?: () => void;
}

export const AppointmentFormFooter: React.FC<AppointmentFormFooterProps> = ({
  mode,
  tab,
  isValid,
  loading,
  cancelled,
  archived,
  paid,
  structureLocked,
  paymentSubmit,
  onClose,
  onSubmit,
  onDelete,
  onRestore,
  onCancel,
}) => {
  const { t } = useI18n();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const onMainTab = mode === 'create' || tab === 'main';
  const canSubmit = onMainTab && !cancelled && !archived;
  const showPaySubmit = Boolean(isMobile && tab === 'payment' && paymentSubmit);
  const showCancelVisit = !isMobile && !archived && onCancel && !cancelled && !paid;

  const restoreAction =
    archived && onRestore ? (
      <Button
        variant="light"
        color="teal"
        size="sm"
        leftSection={<ArrowCounterClockwise size={14} />}
        onClick={onRestore}
        loading={loading}
      >
        {t('common.restore')}
      </Button>
    ) : null;
  const cancelVisitAction = showCancelVisit ? (
    <Button
      variant="subtle"
      color="orange"
      size="sm"
      leftSection={<Prohibit size={14} />}
      onClick={onCancel}
      loading={loading}
      disabled={structureLocked}
    >
      {t('common.cancel')}
    </Button>
  ) : null;
  const archiveAction =
    !archived && onDelete ? (
      <Button
        variant="light"
        color="red"
        size="sm"
        onClick={onDelete}
        loading={loading}
        styles={{ root: { background: 'rgba(250, 82, 82, 0.1)', color: '#fa5252' } }}
      >
        {t('board.toArchive')}
      </Button>
    ) : null;

  const dangerActions =
    mode === 'edit' && tab === 'main' && (restoreAction || cancelVisitAction || archiveAction) ? (
      <>
        {restoreAction}
        {cancelVisitAction}
        {archiveAction}
      </>
    ) : undefined;

  return (
    <FormModalFooter
      meta={undefined}
      metaLabel={undefined}
      metaValue={undefined}
      dangerActions={dangerActions}
      onCancel={onClose}
      stackActions={showPaySubmit}
      submitLabel={
        showPaySubmit
          ? t('form.acceptPayment')
          : canSubmit
            ? mode === 'edit'
              ? t('common.save')
              : t('board.addAppointment')
            : undefined
      }
      onSubmit={showPaySubmit ? paymentSubmit?.onPay : canSubmit ? onSubmit : undefined}
      submitDisabled={showPaySubmit ? !paymentSubmit?.canPay : !isValid}
      loading={showPaySubmit ? Boolean(paymentSubmit?.loading) : loading}
    />
  );
};
