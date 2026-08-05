export { API_BASE_URL, apiRequest, apiPostFormData } from '@/shared/api/apiRequest';
export { ApiError } from '@/shared/api/apiError';
export { authStorage } from '@/shared/api/authStorage';

import { apiRequest } from '@/shared/api/apiRequest';

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface RequestAllParams {
  page?: number;
  pageSize?: number;
  filters?: Record<string, unknown> | null;
}

export async function apiPostGetAll<T>(
  path: string,
  params: RequestAllParams = {},
): Promise<PaginatedResponse<T>> {
  return apiPost<PaginatedResponse<T>, RequestAllParams>(`${path}/get-all`, {
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 100,
    filters: params.filters ?? null,
  });
}

export async function apiFetchAllPost<T>(
  path: string,
  filters?: Record<string, unknown>,
): Promise<T[]> {
  const all: T[] = [];
  let page = 1;
  let totalPages = 1;

  const MAX_PAGES = 1000;

  while (page <= totalPages && page <= MAX_PAGES) {
    const data = await apiPostGetAll<T>(path, { page, pageSize: 100, filters });
    all.push(...data.items);

    if (typeof data.totalPages !== 'number' || data.totalPages < 0) {
      console.warn('apiFetchAllPost: некорректное значение totalPages', data.totalPages);
      break;
    }

    totalPages = data.totalPages;
    page += 1;
  }

  if (page > MAX_PAGES) {
    console.warn(`apiFetchAllPost: достигнут лимит страниц (${MAX_PAGES})`);
  }

  return all;
}

export async function apiGetPaginated<T>(
  path: string,
  params: RequestAllParams = {},
): Promise<PaginatedResponse<T>> {
  const qs = new URLSearchParams();
  qs.set('page', String(params.page ?? 1));
  qs.set('pageSize', String(params.pageSize ?? 100));
  return apiRequest<PaginatedResponse<T>>(`${path}?${qs}`);
}

export async function apiFetchAllGet<T>(path: string): Promise<T[]> {
  const all: T[] = [];
  let page = 1;
  let totalPages = 1;

  const MAX_PAGES = 1000;

  while (page <= totalPages && page <= MAX_PAGES) {
    const data = await apiGetPaginated<T>(path, { page, pageSize: 100 });
    all.push(...data.items);

    if (typeof data.totalPages !== 'number' || data.totalPages < 0) {
      console.warn('apiFetchAllGet: некорректное значение totalPages', data.totalPages);
      break;
    }

    totalPages = data.totalPages;
    page += 1;
  }

  if (page > MAX_PAGES) {
    console.warn(`apiFetchAllGet: достигнут лимит страниц (${MAX_PAGES})`);
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

export async function apiDelete<T = void>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: 'DELETE' });
}

export async function apiPostGetMany<T>(path: string, ids: number[]): Promise<T[]> {
  if (ids.length === 0) return [];

  if (ids.length > 500) {
    console.warn(`apiPostGetMany: слишком много ID (${ids.length}). Рекомендуется батчинг.`);
  }

  return apiPost<T[], number[]>(`${path}/get-many`, ids);
}
