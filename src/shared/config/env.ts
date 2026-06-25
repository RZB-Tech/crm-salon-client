/**
 * URL бэкенда из `.env` (`VITE_API`).
 * Все запросы: `${API_BASE_URL}/api/v1/...`
 */
export const API_URL = import.meta.env.VITE_API ?? 'http://localhost:8000';

export const API_BASE_URL = API_URL.replace(/\/$/, '');

/**
 * Авторизация на фронте — один рычаг `VITE_AUTH=true|false` в `.env`.
 */
export const AUTH_ENABLED = import.meta.env.VITE_AUTH === 'true';

export const getWebSocketUrl = (path: string): string => {
  const url = new URL(API_BASE_URL);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${url.origin}${path}`;
};

export const NOTIFICATIONS_WS_URL = '/api/v1/notifications/ws';
