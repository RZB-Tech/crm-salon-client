import type { BaseEntity } from './common';
import type { Employee } from './employee';

export interface LoginPayload {
  login: string;
  password: string;
}

export interface StaffLoginResponse extends BaseEntity {
  login: string;
  employee: unknown | null;
  firstname: string;
  lastname: string | null;
  middlename: string | null;
  active: boolean;
  staff_type: string;
  tenant_name: string;
}

export type StaffType = 'administrator' | 'employee';

export interface Permission {
  code: number;
  resource: string;
  name: string;
}

export interface Role extends BaseEntity {
  name: string;
  description: string | null;
  permissions: number[];
}

export interface RoleCreatePayload {
  name: string;
  description?: string | null;
  permissions?: number[];
}

export interface RoleUpdatePayload {
  id: number;
  name?: string;
  description?: string | null;
  permissions?: number[] | null;
  archived?: boolean;
}

export interface Staff extends BaseEntity {
  login: string;
  employee_id: number | null;
  active: boolean;
  firstname: string;
  lastname: string | null;
  middlename: string | null;
  permissions: number[];
  roles: Role[];
}

export interface StaffCreatePayload {
  firstname?: string | null;
  lastname?: string | null;
  middlename?: string | null;
  login: string;
  password?: string | null;
  staff_type?: StaffType;
  permissions?: number[] | null;
  roles?: number[] | null;
  employee_id?: number | null;
  active?: boolean;
}

export interface StaffCreateResponse extends Staff {
  password: string;
}

export interface StaffRolesAssignPayload {
  id: number;
  role_ids: number[];
}

export interface StaffPermissionsUpdatePayload {
  id: number;
  permissions: number[];
}

export interface MeResponse extends BaseEntity {
  login: string;
  employee: Employee | null;
  firstname: string | null;
  lastname: string | null;
  middlename: string | null;
  active: boolean;
  staff_type: StaffType;
}
