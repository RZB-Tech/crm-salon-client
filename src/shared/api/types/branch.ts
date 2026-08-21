export interface TenantBranch {
  id: number;
  name: string;
  TIN: string | null;
  parent_id: number | null;
  active: boolean;
  created_at: string;
}

export interface TenantBranchCreatePayload {
  company_name: string;
  company_tin?: string | null;
  admin_login: string;
  admin_firstname: string;
  admin_password?: string | null;
}

export interface TenantBranchCreateResponse {
  tenant: TenantBranch;
  login: string;
  password: string;
}

export interface TenantBranchUpdatePayload {
  branch_id: number;
  name?: string | null;
  TIN?: string | null;
  active?: boolean | null;
}

export interface BranchAdminCreatePayload {
  branch_id: number;
  admin_login: string;
  admin_firstname: string;
  admin_password?: string | null;
}

export interface BranchCredentials {
  login: string;
  password: string;
}

export interface TenantBranchReportItem {
  tenant_id: number;
  tenant_name: string;
  staffs: number;
  employees: number;
  clients: number;
  appointments: number;
  services: number;
  materials: number;
  income: number;
  expense: number;
}

export interface TenantBranchReport {
  branches: TenantBranchReportItem[];
  total: Omit<TenantBranchReportItem, 'tenant_id' | 'tenant_name'>;
}
