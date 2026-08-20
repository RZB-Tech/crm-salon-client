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

export const API_ERROR_MESSAGES: Record<string, string> = {
  PROMOTION_NOT_FOUND: 'Акция не найдена',
  PROMOTION_IS_INACTIVE: 'Акция выключена',
  PROMOTION_TYPE_CONDITION_CONFLICT: 'Тип акции не сочетается с выбранными условиями',
  PROMOTION_HAS_CONFLICT_WITH_TARGET: 'На эту услугу или товар уже есть активная акция',
  PROMOTION_DISCOUNT_PERCENTAGE_EXCEED: 'Процент скидки должен быть от 1 до 100',
  GIFT_CARD_NOT_FOUND: 'Купон не найден',
  GIFT_CARD_HAS_CHARGED: 'Купон уже использован — отменить нельзя',
  GIFT_CARD_INSUFFICIENT_AMOUNT: 'На купоне недостаточно средств',
  GIFT_CARD_CANCELLED: 'Купон отменён',
  GIFT_CARD_UNUSABLE: 'Купон нельзя использовать',
  GIFT_CARD_CLIENT_CONFLICT: 'Этот купон привязан к другому клиенту',
};

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
    if (!text) return { message: `Ошибка API: ${response.status}` };

    const data = JSON.parse(text) as ApiErrorBody;
    const errorCode = data.error_code;
    if (errorCode && API_ERROR_MESSAGES[errorCode]) {
      return { message: API_ERROR_MESSAGES[errorCode], errorCode };
    }

    if (typeof data.detail === 'string') return { message: data.detail, errorCode };
    if (Array.isArray(data.detail) && data.detail[0]?.msg) {
      return { message: data.detail[0].msg, errorCode };
    }
    if (data.metadata?.message) return { message: data.metadata.message, errorCode };
  } catch {
    return { message: `Ошибка сервера: ${response.status} ${response.statusText}` };
  }
  return { message: `Ошибка API: ${response.status}` };
};

export const parseErrorMessage = async (response: Response): Promise<string> =>
  (await parseApiError(response)).message;
