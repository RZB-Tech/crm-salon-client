export type FilterTable =
  | 'appointments'
  | 'clients'
  | 'employees'
  | 'employee_absences'
  | 'employee_work_schedules'
  | 'materials'
  | 'payments'
  | 'payrolls'
  | 'transactions'
  | 'receipts'
  | 'service_categories'
  | 'services'
  | 'specializations'
  | 'notifications'
  | 'roles';

export type FilterFieldType = 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'enum';

export interface FilterFieldSchema {
  field: string;
  type: FilterFieldType;
  options?: string[] | null;
}

/** Значение фильтра get-all: равенство или операторы сравнения */
export type FilterValue =
  | string
  | number
  | boolean
  | {
      eq?: string | number | boolean;
      ne?: string | number | boolean;
      gt?: string | number;
      gte?: string | number;
      lt?: string | number;
      lte?: string | number;
    };

export type ListFilters = Record<string, FilterValue>;
