export interface AnalyticsFilters {
  start_date: string;
  end_date: string;
  branch_id?: number;
}

export type AnalyticsPeriod = 'by day' | 'by week' | 'by month' | 'by year';

export interface AnalyticsPeriodFilters extends AnalyticsFilters {
  period: AnalyticsPeriod;
}

export interface ReceiptAnalytics {
  amount: number;
  paid: number;
  unpaid: number;
  cancelled: number;
  average_receipt_sum: number;
  total_paid_sum: number;
}

export interface AppointmentAnalytics {
  amount: number;
  finished: number;
  cancelled: number;
  absent: number;
}

export interface PaymentMethodStat {
  amount: number;
  profit: number;
  percentage: number;
}

export interface PaymentMethodsAnalytics {
  cash: PaymentMethodStat;
  card: PaymentMethodStat;
  deposit: PaymentMethodStat;
  gift_card: PaymentMethodStat;
  bank_transfer?: PaymentMethodStat;
}

export interface TransactionAnalytics {
  payment_methods: PaymentMethodsAnalytics;
  by_service: PaymentMethodStat;
  by_material: PaymentMethodStat;
  by_giftCard: PaymentMethodStat;
  not_fully_paid_receipts_sum: number;
  total_profit: number;
}

export interface TransactionPeriodItem {
  date: string;
  revenue: number;
}

export interface TransactionPeriodAnalytics {
  items: TransactionPeriodItem[];
}

export interface EmployeeAnalyticsItem {
  employee_id: number;
  employee_fullname: string;
  appointments: number;
  services: number;
  revenue: number;
}

export interface EmployeeAnalytics {
  items: EmployeeAnalyticsItem[];
}

export interface ServiceAnalyticsItem {
  service_id: number;
  service_name: string;
  amount: number;
  revenue: number;
}

export interface ServiceAnalytics {
  items: ServiceAnalyticsItem[];
}
