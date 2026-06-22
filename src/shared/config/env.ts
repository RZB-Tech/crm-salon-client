/**
 * Базовый URL API.
 * - Если задан VITE_API_URL — запросы идут напрямую на бэкенд.
 * - Если пустой — относительные пути (/api/...) идут на Vite dev server (5173),
 *   который проксирует на VITE_API_PROXY_TARGET.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

export const getWebSocketUrl = (path: string): string => {
  if (API_BASE_URL) {
    const url = new URL(API_BASE_URL);
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${url.origin}${path}`;
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}${path}`;
};

export const NOTIFICATIONS_WS_URL = '/api/v1/notifications/ws';
