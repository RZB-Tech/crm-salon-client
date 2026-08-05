import { AUTH_ENABLED } from '@/shared/config/env';

const AUTH_KEY = 'salon_auth';
const TENANT_NAME_KEY = 'salon_tenant_name';

export const authStorage = {
  isAuthenticated: (): boolean =>
    !AUTH_ENABLED || localStorage.getItem(AUTH_KEY) === '1',
  getTenantName: (): string | null => localStorage.getItem(TENANT_NAME_KEY),
  setTenantName: (name: string): void => {
    localStorage.setItem(TENANT_NAME_KEY, name);
  },
  clearSession: (): void => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TENANT_NAME_KEY);
  },
  setAuthenticated: (value: boolean): void => {
    if (value) {
      localStorage.setItem(AUTH_KEY, '1');
    } else {
      authStorage.clearSession();
    }
  },
  clearIfAuthDisabled: (): void => {
    if (!AUTH_ENABLED) {
      authStorage.clearSession();
    }
  },
};
