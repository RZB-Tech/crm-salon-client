export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const parseErrorMessage = async (response: Response): Promise<string> => {
  try {
    const text = await response.text();
    if (!text) return `Ошибка API: ${response.status}`;

    const data = JSON.parse(text) as { detail?: string | { msg: string }[] };
    if (typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.detail) && data.detail[0]?.msg) return data.detail[0].msg;
  } catch {
    return `Ошибка сервера: ${response.status} ${response.statusText}`;
  }
  return `Ошибка API: ${response.status}`;
};
