import React from 'react';
import { TicketIcon } from '@phosphor-icons/react';
import { useCreateGiftCard, useUpdateGiftCard } from '@/shared/api/hooks/useGiftCards';
import { useClients } from '@/shared/api/hooks/useClients';
import type { GiftCard } from '@/shared/api/types';
import { getClientFullName } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { FormModal, FormModalFooter } from '@/shared/ui';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import {
  emptyGiftCardForm,
  formToCreatePayload,
  formToUpdatePayload,
  giftCardToForm,
  isGiftCardFormValid,
  type GiftCardFormState,
} from '../lib/giftCardForm';
import { GiftCardFormFields } from './GiftCardFormFields';

interface GiftCardFormModalProps {
  opened: boolean;
  giftCard: GiftCard | null;
  onClose: () => void;
}

export const GiftCardFormModal: React.FC<GiftCardFormModalProps> = ({
  opened,
  giftCard,
  onClose,
}) => {
  const { t } = useI18n();
  const [form, setForm] = React.useState<GiftCardFormState>(emptyGiftCardForm);
  const { data: clients } = useClients(false);
  const createGiftCard = useCreateGiftCard();
  const updateGiftCard = useUpdateGiftCard();

  useResetOnOpen(opened, () => setForm(giftCard ? giftCardToForm(giftCard) : emptyGiftCardForm()));

  const clientOptions = React.useMemo(
    () => (clients ?? []).map((client) => ({ value: String(client.id), label: getClientFullName(client) })),
    [clients],
  );

  const setField = <K extends keyof GiftCardFormState>(key: K, value: GiftCardFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = React.useCallback(() => {
    if (!isGiftCardFormValid(form, Boolean(giftCard))) return;
    if (giftCard) {
      updateGiftCard.mutate(formToUpdatePayload(giftCard.id, form), { onSuccess: onClose });
      return;
    }
    createGiftCard.mutate(formToCreatePayload(form), { onSuccess: onClose });
  }, [form, giftCard, createGiftCard, updateGiftCard, onClose]);

  const loading = createGiftCard.isPending || updateGiftCard.isPending;

  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title={giftCard ? t('form.giftCardNamed', { code: giftCard.code }) : t('giftCards.newCard')}
      icon={<TicketIcon />}
      size={567}
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel={giftCard ? t('common.save') : t('form.createGiftCard')}
          onSubmit={handleSubmit}
          submitDisabled={!isGiftCardFormValid(form, Boolean(giftCard))}
          loading={loading}
        />
      }
    >
      <GiftCardFormFields
        form={form}
        isEdit={Boolean(giftCard)}
        clientOptions={clientOptions}
        onChange={setField}
      />
    </FormModal>
  );
};
