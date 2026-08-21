export type BranchFilter = 'all' | 'active' | 'inactive';

export const isLoginValid = (login: string): boolean => /^[a-zA-Z0-9]+$/.test(login.trim());

export const emptyCreateForm = () => ({
  company_name: '',
  company_tin: '',
  admin_login: '',
  admin_firstname: '',
  admin_password: '',
});

export type BranchCreateFormState = ReturnType<typeof emptyCreateForm>;

export const isCreateFormValid = (form: BranchCreateFormState): boolean =>
  form.company_name.trim().length > 0 &&
  isLoginValid(form.admin_login) &&
  form.admin_firstname.trim().length > 0 &&
  (form.admin_password.trim().length === 0 || form.admin_password.trim().length >= 6);

export const emptyAdminForm = () => ({
  admin_login: '',
  admin_firstname: '',
  admin_password: '',
});

export type BranchAdminFormState = ReturnType<typeof emptyAdminForm>;

export const isAdminFormValid = (form: BranchAdminFormState): boolean =>
  isLoginValid(form.admin_login) &&
  form.admin_firstname.trim().length > 0 &&
  (form.admin_password.trim().length === 0 || form.admin_password.trim().length >= 6);
