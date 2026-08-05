export const TAB_VALUES = ['overview', 'schedule', 'payments', 'finance', 'services', 'audit'] as const;
export type TabValue = (typeof TAB_VALUES)[number];

export const isTabValue = (value: string | null): value is TabValue =>
  TAB_VALUES.includes(value as TabValue);
