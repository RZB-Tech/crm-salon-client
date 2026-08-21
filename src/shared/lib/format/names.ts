import type { Client, Employee } from '@/shared/api/types';
import { t } from '@/shared/lib/i18n';

export const getEmployeeFullName = (
  employee: Pick<Employee, 'firstname' | 'lastname' | 'middlename'>,
): string => [employee.firstname, employee.middlename, employee.lastname].filter(Boolean).join(' ');

export const getEmployeeInitials = (employee: Pick<Employee, 'firstname' | 'lastname'>): string => {
  const first = employee.firstname.charAt(0).toUpperCase();
  const last = employee.lastname?.charAt(0).toUpperCase() ?? '';
  return `${first}${last}` || first;
};

export const getClientFullName = (
  client: Pick<Client, 'firstname' | 'lastname'> & { middlename?: string | null },
): string => [client.firstname, client.middlename, client.lastname].filter(Boolean).join(' ');

export const getClientInitials = (client: Pick<Client, 'firstname' | 'lastname'>): string =>
  getEmployeeInitials(client);

/** «Иванов И.И.» — короткое имя для шапки карточки клиента */
export const getClientShortName = (
  client: Pick<Client, 'firstname' | 'lastname'> & { middlename?: string | null },
): string => {
  const last = client.lastname?.trim() || '';
  const first = client.firstname?.trim() || '';
  const middle = client.middlename?.trim() || '';
  if (!last) return [first, middle].filter(Boolean).join(' ') || t('form.client');
  const initials = [first, middle]
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}.`)
    .join('');
  return [last, initials].filter(Boolean).join(' ');
};
