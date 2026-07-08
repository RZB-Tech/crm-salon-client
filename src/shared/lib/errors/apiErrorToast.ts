import { addNotification } from '@/shared/lib/notifications';

interface ErrorLike {
  status?: number;
  message?: string;
}

const RECENT_TOAST_TTL = 1800;
const recentToasts = new Map<string, number>();

const STATUS_TITLES: Record<number, string> = {
  400: 'Проверьте данные',
  401: 'Нужен вход',
  403: 'Нет доступа',
  404: 'Не найдено',
  409: 'Конфликт данных',
  422: 'Проверьте форму'
};

const isErrorLike = (error: unknown): error is ErrorLike =>
  typeof error === 'object' && error !== null;

export const getApiErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) return error.message;
  if (isErrorLike(error) && typeof error.message === 'string') return error.message;
  return 'Что-то пошло не так. Попробуйте ещё раз.';
};

export const getApiErrorTitle = (error: unknown): string => {
  if (isErrorLike(error) && typeof error.status === 'number') {
    return STATUS_TITLES[error.status] ?? (error.status >= 500 ? 'Ошибка сервера' : 'Ошибка');
  }

  return 'Ошибка';
};

export const showApiErrorToast = (error: unknown): void => {
  const title = getApiErrorTitle(error);
  const message = getApiErrorMessage(error);
  const key = `${title}:${message}`;
  const now = Date.now();
  const lastShownAt = recentToasts.get(key);

  if (lastShownAt && now - lastShownAt < RECENT_TOAST_TTL) return;

  recentToasts.set(key, now);
  addNotification.error({ title, message });
};
