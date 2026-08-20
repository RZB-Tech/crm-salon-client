import React from 'react';
import { Select } from '@mantine/core';
import { useGiftCards } from '@/shared/api/hooks/useGiftCards';
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
      label="Купон"
      required
      searchable
      placeholder="Выберите купон"
      data={options}
      value={value}
      onChange={(next) => {
        const card = (giftCards ?? []).find((item) => String(item.id) === next);
        onChange(next, card?.remain_amount);
      }}
      nothingFoundMessage="Нет доступных купонов"
    />
  );
};
