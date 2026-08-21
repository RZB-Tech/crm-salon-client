import React from 'react';
import { Select } from '@mantine/core';
import { useGiftCards } from '@/shared/api/hooks/useGiftCards';
import { useI18n } from '@/shared/lib/i18n';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { isGiftCardUsable, toGiftCardPayLabel } from '../lib/giftCardHelpers';

interface GiftCardPaySelectProps {
  clientId: number | null;
  value: string | null;
  onChange: (value: string | null, remainAmount?: number) => void;
}

export const GiftCardPaySelect: React.FC<GiftCardPaySelectProps> = ({
  clientId,
  value,
  onChange,
}) => {
  const { t } = useI18n();
  const { isAdmin, hasPermission } = useAccess();
  const canRead = isAdmin || hasPermission(PermissionCode.GIFT_CARD_GET);
  const { data: giftCards } = useGiftCards(false, canRead);

  const options = React.useMemo(
    () =>
      (giftCards ?? [])
        .filter((card) => isGiftCardUsable(card, clientId))
        .map((card) => ({ value: String(card.id), label: toGiftCardPayLabel(card) })),
    [giftCards, clientId],
  );

  return (
    <Select
      label={t('form.coupon')}
      required
      searchable
      placeholder={t('form.selectGiftCard')}
      data={options}
      value={value}
      onChange={(next) => {
        const card = (giftCards ?? []).find((item) => String(item.id) === next);
        onChange(next, card?.remain_amount);
      }}
      nothingFoundMessage={t('form.noGiftCards')}
    />
  );
};
