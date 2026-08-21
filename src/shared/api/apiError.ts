import { t } from '@/shared/lib/i18n';

export class ApiError extends Error {
  status: number;
  errorCode?: string;

  constructor(status: number, message: string, errorCode?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errorCode = errorCode;
  }
}

export const getApiErrorMessage = (code?: string): string | undefined => {
  if (!code) return undefined;
  const message = t(`errors.${code}`);
  return message === `errors.${code}` ? undefined : message;
};

export const API_ERROR_MESSAGES: Record<string, string> = new Proxy({} as Record<string, string>, {
  get: (_target, code: string) => getApiErrorMessage(code) ?? '',
});

interface ApiErrorBody {
  detail?: string | { msg: string }[];
  error_code?: string;
  metadata?: { message?: string };
}

export const parseApiError = async (
  response: Response,
): Promise<{ message: string; errorCode?: string }> => {
  try {
    const text = await response.text();
    if (!text) return { message: t('common.apiError', { status: response.status }) };

    const data = JSON.parse(text) as ApiErrorBody;
    const errorCode = data.error_code;
    const mapped = getApiErrorMessage(errorCode);
    if (mapped) {
      return { message: mapped, errorCode };
    }

    if (typeof data.detail === 'string') return { message: data.detail, errorCode };
    if (Array.isArray(data.detail) && data.detail[0]?.msg) {
      return { message: data.detail[0].msg, errorCode };
    }
    if (data.metadata?.message) return { message: data.metadata.message, errorCode };
  } catch {
    return {
      message: t('common.serverStatusError', {
        status: response.status,
        statusText: response.statusText,
      }),
    };
  }
  return { message: t('common.apiError', { status: response.status }) };
};

export const parseErrorMessage = async (response: Response): Promise<string> =>
  (await parseApiError(response)).message;
