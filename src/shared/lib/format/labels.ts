import type { AbsenceType, PayrollType, Sex } from '@/shared/api/types';

export const SEX_LABELS: Record<Sex, string> = {
  male: 'Мужской',
  female: 'Женский',
};

export const PAYROLL_TYPE_LABELS: Record<PayrollType, string> = {
  salary: 'Зарплата',
  bonus: 'Бонус',
  penalty: 'Штраф',
  commission: 'Комиссия',
};

export const ABSENCE_TYPE_LABELS: Record<AbsenceType, string> = {
  sick: 'Больничный',
  vacation: 'Отпуск',
  'day off': 'Выходной',
  weekend: 'Выходные',
  other: 'Другое',
};

export const DAY_OF_WEEK_LABELS: Record<number, string> = {
  1: 'Пн',
  2: 'Вт',
  3: 'Ср',
  4: 'Чт',
  5: 'Пт',
  6: 'Сб',
  7: 'Вс',
};

export const MEASUREMENT_UNIT_LABELS: Record<string, string> = {
  piece: 'шт.',
  pack: 'уп.',
  box: 'кор.',
  bottle: 'фл.',
  milliliter: 'мл',
  liter: 'л',
  gramm: 'г',
  kilogram: 'кг',
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: 'Наличные',
  card: 'Карта',
  'bank transfer': 'Банковский перевод',
  deposit: 'Депозит',
};

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  awaiting: 'Ожидание',
  started: 'Начата',
  finished: 'Завершена',
  cancelled: 'Отменена',
};

export const RECEIPT_STATUS_LABELS: Record<string, string> = {
  pending: 'Ожидает оплаты',
  paid: 'Оплачен',
  cancelled: 'Отменён',
};

export const APPOINTMENT_CANCELLED_REASON_LABELS: Record<string, string> = {
  'client changed his mind': 'Клиент передумал',
  'mistaken input': 'Ошибочный ввод',
  'incorrect client': 'Некорректный клиент',
  'incorrect date': 'Некорректная дата',
};

export const RECEIPT_TYPE_LABELS: Record<string, string> = {
  appointment: 'По записи',
  'direct sale': 'Прямая продажа',
};

export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  reminder: 'Напоминание',
  other: 'Другое',
};

export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  income: 'Доход',
  expense: 'Расход',
};

export const TRANSACTION_CATEGORY_LABELS: Record<string, string> = {
  receipt: 'Оплата чека',
  'employee payment': 'Выплата сотруднику',
  utility: 'Коммунальные',
  internet: 'Интернет',
  telephone: 'Телефон',
  other: 'Прочее',
};

export const TRANSACTION_METHOD_LABELS: Record<string, string> = {
  cash: 'Наличные',
  card: 'Карта',
  'bank transfer': 'Банковский перевод',
  deposit: 'Депозит',
};
