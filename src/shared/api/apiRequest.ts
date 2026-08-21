import { API_BASE_URL, AUTH_ENABLED } from '@/shared/config/env';
import { t } from '@/shared/lib/i18n';
import { authStorage } from '@/shared/api/authStorage';
import { ApiError, parseApiError } from '@/shared/api/apiError';

export { API_BASE_URL };

let isRedirecting = false;

export function logoutOnUnauthorized(): void {
  if (!AUTH_ENABLED) return;
  authStorage.setAuthenticated(false);
  if (!isRedirecting && window.location.pathname !== '/login') {
    isRedirecting = true;
    window.location.href = '/login';
  }
}

/** EventSource не отдаёт HTTP-статус; проверяем куки отдельным запросом. */
export async function isSessionAlive(): Promise<boolean> {
  if (!AUTH_ENABLED) return true;
  try {
    await apiRequest('/api/v1/auth/me');
    return true;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      logoutOnUnauthorized();
      return false;
    }
    return true;
  }
}

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: 'include',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (AUTH_ENABLED && response.status === 401 && !path.includes('/auth/')) {
      logoutOnUnauthorized();
    }

    if (!response.ok) {
      const parsed = await parseApiError(response);
      throw new ApiError(response.status, parsed.message, parsed.errorCode);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof TypeError) {
      const networkError = new Error(t('common.networkError'));
      (networkError as { cause?: unknown }).cause = error;
      throw networkError;
    }
    throw error;
  }
}

export async function apiPostFormData<T>(path: string, formData: FormData): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    method: 'POST',
    body: formData,
  });

  if (AUTH_ENABLED && response.status === 401 && !path.includes('/auth/')) {
    logoutOnUnauthorized();
  }

  if (!response.ok) {
    const parsed = await parseApiError(response);
    throw new ApiError(response.status, parsed.message, parsed.errorCode);
  }

  return response.json() as Promise<T>;
}
