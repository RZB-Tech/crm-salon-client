import { getDateLocale, t } from '@/shared/lib/i18n';

export const formatPrice = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat(getDateLocale()).format(num) + ' ' + t('common.currency');
};

