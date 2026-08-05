import type { Client, Employee } from '@/shared/api/types';

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
