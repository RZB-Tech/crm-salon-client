import { API_BASE_URL, AUTH_ENABLED } from '@/shared/config/env';
import { authStorage } from '@/shared/api/authStorage';
import { ApiError, parseErrorMessage } from '@/shared/api/apiError';

export { API_BASE_URL };

let isRedirecting = false;

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
      authStorage.setAuthenticated(false);
      if (!isRedirecting && window.location.pathname !== '/login') {
        isRedirecting = true;
        window.location.href = '/login';
      }
    }

    if (!response.ok) {
      throw new ApiError(response.status, await parseErrorMessage(response));
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof TypeError) {
      const networkError = new Error('Нет соединения с сервером. Проверьте интернет-соединение.');
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
    authStorage.setAuthenticated(false);
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorMessage(response));
  }

  return response.json() as Promise<T>;
}
