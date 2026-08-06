import type { Client, ClientCreatePayload, Sex } from '@/shared/api/types';

export interface ClientFormState {
  firstname: string;
  lastname: string;
  middlename: string;
  sex: Sex;
  phone: string;
  birth_date: string;
  deposit: number;
  notes: string;
}

export const emptyClientForm = (): ClientFormState => ({
  firstname: '',
  lastname: '',
  middlename: '',
  sex: 'female',
  phone: '',
  birth_date: '',
  deposit: 0,
  notes: ''
});

export const clientToForm = (client: Client): ClientFormState => ({
  firstname: client.firstname,
  lastname: client.lastname ?? '',
  middlename: client.middlename ?? '',
  sex: client.sex,
  phone: client.phone ?? '',
  birth_date: client.birth_date ?? '',
  deposit: client.deposit,
  notes: client.notes ?? ''
});

export const clientFormToPayload = (form: ClientFormState): ClientCreatePayload => ({
  firstname: form.firstname,
  lastname: form.lastname || null,
  middlename: form.middlename || null,
  sex: form.sex,
  phone: form.phone || null,
  birth_date: form.birth_date || null,
  deposit: form.deposit,
  notes: form.notes || null
});
