export type AuditLogTable =
  | 'appointments'
  | 'appointment_records'
  | 'appointment_services'
  | 'clients'
  | 'employees'
  | 'employee_absences'
  | 'employee_work_schedules'
  | 'materials'
  | 'payments'
  | 'payrolls'
  | 'receipt_items'
  | 'receipts'
  | 'service_categories'
  | 'services'
  | 'specializations'
  | 'staffs';

export interface AuditLog {
  id: number;
  table_name: string;
  record_id: number;
  action: string;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  changed_by: number;
  changed_at: string;
}

export interface AuditLogsParams {
  table_name: AuditLogTable;
  record_id: number;
  page?: number;
  pageSize?: number;
}
