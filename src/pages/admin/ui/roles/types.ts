export interface RoleForm {
  name: string;
  description: string;
  permissions: number[];
}

export const INITIAL_FORM: RoleForm = { name: '', description: '', permissions: [] };
