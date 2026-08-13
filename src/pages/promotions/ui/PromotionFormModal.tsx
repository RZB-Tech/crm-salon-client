import React from 'react';
import { NumberInput, SegmentedControl, Select, Stack, Switch, Textarea, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { TagIcon } from '@phosphor-icons/react';
import { useCreatePromotion, useUpdatePromotion } from '@/shared/api/hooks/usePromotions';
import { useMaterials } from '@/shared/api/hooks/useMaterials';
import { useServices } from '@/shared/api/hooks/useServices';
import type { Promotion, PromotionType } from '@/shared/api/types';
import { FormFieldGrid, FormModal, FormModalFooter, FormSection } from '@/shared/ui';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import {
  emptyPromotionForm,
  formToCreatePayload,
  formToUpdatePayload,
  isPromotionFormValid,
  promotionToForm,
  type PromotionFormState,
  type PromotionTargetKind,
} from '../lib/promotionForm';

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
      title={promotion ? 'Редактировать акцию' : 'Новая акция'}
      subtitle={promotion ? promotion.name : 'Скидка на услугу или товар'}
      icon={<TagIcon size={22} />}
      size="lg"
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel={promotion ? 'Сохранить' : 'Создать'}
          onSubmit={handleSubmit}
          submitDisabled={!isPromotionFormValid(form)}
          loading={loading}
        />
      }
    >
      <FormSection title="Основное">
        <Stack gap="sm">
          <TextInput
            label="Название"
            required
            value={form.name}
            onChange={(event) => setField('name', event.currentTarget.value)}
          />
          <SegmentedControl
            fullWidth
            value={form.targetKind}
            onChange={(value) => {
              setField('targetKind', value as PromotionTargetKind);
              setField('targetId', null);
            }}
            data={[
              { value: 'service', label: 'Услуга' },
              { value: 'material', label: 'Товар' },
            ]}
          />
          <Select
            label={form.targetKind === 'service' ? 'Услуга' : 'Товар'}
            required
            searchable
            data={form.targetKind === 'service' ? serviceOptions : materialOptions}
            value={form.targetId}
            onChange={(value) => setField('targetId', value)}
            nothingFoundMessage="Ничего не найдено"
          />
        </Stack>
      </FormSection>

      <FormSection title="Скидка">
        <FormFieldGrid>
          <Select
            label="Тип"
            data={[
              { value: 'percentage', label: 'Процент' },
              { value: 'fixed_amount', label: 'Фиксированная сумма' },
            ]}
            value={form.promoType}
            onChange={(value) => setField('promoType', (value as PromotionType) ?? 'percentage')}
          />
          <NumberInput
            label="Значение"
            required
            min={1}
            max={form.promoType === 'percentage' ? 100 : undefined}
            value={form.discountValue}
            onChange={(value) => setField('discountValue', Number(value) || 0)}
            suffix={form.promoType === 'percentage' ? ' %' : ' сум'}
            thousandSeparator=" "
            description={form.promoType === 'percentage' ? 'от 1 до 100' : undefined}
          />
        </FormFieldGrid>
      </FormSection>

      <FormSection title="Период">
        <FormFieldGrid>
          <DateInput
            label="С"
            clearable
            value={form.startDate || null}
            onChange={(value) => setField('startDate', value ?? '')}
          />
          <DateInput
            label="По"
            clearable
            value={form.endDate || null}
            onChange={(value) => setField('endDate', value ?? '')}
          />
        </FormFieldGrid>
        <Switch
          mt="sm"
          label="Включена"
          checked={form.isActive}
          onChange={(event) => setField('isActive', event.currentTarget.checked)}
        />
      </FormSection>

      <FormSection title="Описание" muted>
        <Textarea
          placeholder="Необязательно"
          autosize
          minRows={2}
          value={form.description}
          onChange={(event) => setField('description', event.currentTarget.value)}
        />
      </FormSection>
    </FormModal>
  );
};
