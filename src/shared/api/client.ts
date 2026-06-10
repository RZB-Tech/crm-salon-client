import { API_BASE_URL } from '@/shared/config/env';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(response.status, `Ошибка API: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

const buildPagePath = (path: string, page: number): string => {
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}page=${page}`;
};

export async function apiListRequest<T>(path: string, options?: RequestInit): Promise<T[]> {
  const data = await apiRequest<PaginatedResponse<T> | T[]>(path, options);

  if (Array.isArray(data)) {
    return data;
  }

  return data.results ?? [];
}

export async function apiListRequestAll<T>(path: string): Promise<T[]> {
  const all: T[] = [];
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    const data = await apiRequest<PaginatedResponse<T> | T[]>(buildPagePath(path, page));

    if (Array.isArray(data)) {
      return data;
    }

    all.push(...(data.results ?? []));
    hasNext = Boolean(data.next);
    page += 1;
  }

  return all;
}

export async function apiPost<T, B>(path: string, body: B): Promise<T> {
  return apiRequest<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function apiPatch<T, B>(path: string, body: B): Promise<T> {
  return apiRequest<T>(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function apiDelete(path: string): Promise<void> {
  return apiRequest<void>(path, { method: 'DELETE' });
}
