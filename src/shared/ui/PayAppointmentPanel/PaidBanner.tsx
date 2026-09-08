import React from 'react';
import { Button, Group, Stack, Text } from '@mantine/core';
import { CheckCircle, XIcon } from '@phosphor-icons/react';
import type { Receipt } from '@/shared/api/types';
import { formatPrice } from '@/shared/lib/format';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { useI18n } from '@/shared/lib/i18n';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { PaymentStepper } from './PaymentStepper';
import styles from './pay-appointment-panel.module.css';

interface PaidBannerProps {
  receipt: Receipt | null | undefined;
  cancelConfirmOpen: boolean;
  cancelPending: boolean;
  onOpenCancelConfirm: () => void;
  onCloseCancelConfirm: () => void;
  onConfirmCancel: () => void;
}

export const PaidBanner: React.FC<PaidBannerProps> = ({
  receipt,
  cancelConfirmOpen,
  cancelPending,
  onOpenCancelConfirm,
  onCloseCancelConfirm,
  onConfirmCancel,
}) => {
  const { t } = useI18n();
  const isMobile = useIsMobile();

  return (
    <Stack gap="md">
      {isMobile && <PaymentStepper step1Done step2Done step3Done />}
      <div className={isMobile ? styles.paidReceiptCard : styles.paidBanner}>
        {isMobile ? (
          <>
            <Group justify="space-between" wrap="nowrap" align="flex-start">
              <Text className={styles.paidReceiptTitle}>
                {receipt ? t('form.receiptNamed', { id: receipt.id }) : t('finance.paidFully')}
              </Text>
              {receipt && (
                <Button
                  className={styles.cancelReceiptBtn}
                  variant="subtle"
                  color="red"
                  size="xs"
                  leftSection={<XIcon size={12} />}
                  onClick={onOpenCancelConfirm}
                  loading={cancelPending}
                >
                  {t('form.cancelReceipt')}
                </Button>
              )}
            </Group>
            <Text className={styles.receiptStatusPaid}>{t('finance.paidFully')}</Text>
          </>
        ) : (
          <>
            <div>
              <Group gap={8} mb={4}>
                <CheckCircle size={18} color="var(--mantine-color-teal-7)" />
                <Text size="sm" fw={700} c="teal.8">
                  {t('finance.paidFully')}
                </Text>
              </Group>
              {receipt && (
                <Text size="xs" c="dimmed">
                  {t('form.receiptNamed', { id: receipt.id })} · {formatPrice(receipt.total_amount)}
                </Text>
              )}
            </div>
            {receipt && (
              <Button
                variant="light"
                color="orange"
                size="xs"
                onClick={onOpenCancelConfirm}
                loading={cancelPending}
              >
                {t('form.cancelReceipt')}
              </Button>
            )}
          </>
        )}
      </div>
      <ConfirmModal
        opened={cancelConfirmOpen}
        title={t('form.cancelReceipt')}
        message={t('finance.cancelReceiptPaidMessage')}
        confirmLabel={t('form.cancelReceipt')}
        loading={cancelPending}
        onConfirm={onConfirmCancel}
        onClose={onCloseCancelConfirm}
      />
    </Stack>
  );
};
