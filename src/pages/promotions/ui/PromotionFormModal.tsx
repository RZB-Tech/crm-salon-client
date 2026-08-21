import React from 'react';
import { TagIcon } from '@phosphor-icons/react';
import { useCreatePromotion, useUpdatePromotion } from '@/shared/api/hooks/usePromotions';
import { useMaterials } from '@/shared/api/hooks/useMaterials';
import { useServices } from '@/shared/api/hooks/useServices';
import type { Promotion } from '@/shared/api/types';
import { FormModal, FormModalFooter } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import {
  emptyPromotionForm,
  formToCreatePayload,
  formToUpdatePayload,
  isPromotionFormValid,
  promotionToForm,
  type PromotionFormState,
} from '../lib/promotionForm';
import { PromotionFormFields } from './PromotionFormFields';

interface PromotionFormModalProps {
  opened: boolean;
  promotion: Promotion | null;
  onClose: () => void;
}

export const PromotionFormModal: React.FC<PromotionFormModalProps> = ({
  opened,
  promotion,
  onClose,
}) => {
  const { t } = useI18n();
  const [form, setForm] = React.useState<PromotionFormState>(emptyPromotionForm);
  const { data: services } = useServices(false);
  const { data: materials } = useMaterials(false);
  const createPromotion = useCreatePromotion();
  const updatePromotion = useUpdatePromotion();

  useResetOnOpen(opened, () => setForm(promotion ? promotionToForm(promotion) : emptyPromotionForm()));

  const serviceOptions = React.useMemo(
    () => (services ?? []).map((item) => ({ value: String(item.id), label: item.name })),
    [services],
  );
  const materialOptions = React.useMemo(
    () => (materials ?? []).map((item) => ({ value: String(item.id), label: item.name })),
    [materials],
  );

  const setField = <K extends keyof PromotionFormState>(key: K, value: PromotionFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = React.useCallback(() => {
    if (!isPromotionFormValid(form)) return;
    if (promotion) {
      updatePromotion.mutate(formToUpdatePayload(promotion.id, form, promotion), { onSuccess: onClose });
      return;
    }
    createPromotion.mutate(formToCreatePayload(form), { onSuccess: onClose });
  }, [form, promotion, createPromotion, updatePromotion, onClose]);

  const loading = createPromotion.isPending || updatePromotion.isPending;

  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title={promotion ? t('form.editPromo') : t('form.addPromo')}
      icon={<TagIcon />}
      size={567}
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel={promotion ? t('common.save') : t('form.addPromo')}
          onSubmit={handleSubmit}
          submitDisabled={!isPromotionFormValid(form)}
          loading={loading}
        />
      }
    >
      <PromotionFormFields
        form={form}
        serviceOptions={serviceOptions}
        materialOptions={materialOptions}
        onChange={setField}
      />
    </FormModal>
  );
};
