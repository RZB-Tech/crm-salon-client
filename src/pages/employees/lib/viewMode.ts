import type { ListViewMode } from '@/shared/ui';

export const VIEW_STORAGE_KEY = 'employees.view';

export const readStoredView = (): ListViewMode => {
  try {
    const value = localStorage.getItem(VIEW_STORAGE_KEY);
    return value === 'table' ? 'table' : 'cards';
  } catch {
    return 'cards';
  }
};
