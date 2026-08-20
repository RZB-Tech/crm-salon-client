import type { GiftCard } from '@/shared/api/types';
import { formatPrice } from '@/shared/lib/format';

export type GiftCardViewStatus = 'active' | 'used' | 'expired' | 'cancelled';

export const GIFT_CARD_STATUS_COLORS: Record<GiftCardViewStatus, string> = {
  active: 'teal',
  used: 'gray',
  expired: 'orange',
  cancelled: 'red',
};

export const getGiftCardViewStatus = (card: GiftCard, now = Date.now()): GiftCardViewStatus => {
  if (card.status === 'cancelled') return 'cancelled';
  if (card.status === 'expired') return 'expired';
  if (card.expiration_date) {
    const expiresAt = new Date(card.expiration_date).getTime();
    if (!Number.isNaN(expiresAt) && expiresAt < now) return 'expired';
  }
  if (card.remain_amount <= 0) return 'used';
  return 'active';
};

export const canCancelGiftCard = (card: GiftCard): boolean =>
  getGiftCardViewStatus(card) === 'active' && card.remain_amount === card.initial_amount;

export const isGiftCardUsable = (
  card: GiftCard,
  clientId: number | null,
  now = Date.now(),
): boolean => {
  if (getGiftCardViewStatus(card, now) !== 'active') return false;
  if (card.client_id != null && card.client_id !== clientId) return false;
  return card.remain_amount > 0;
};

export const toGiftCardPayLabel = (card: GiftCard): string =>
  `${card.code} · ${formatPrice(card.remain_amount)}`;
