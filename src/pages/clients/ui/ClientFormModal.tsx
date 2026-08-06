import React from 'react';
import { Badge, NumberInput, Select, Stack, Textarea, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { UserPlusIcon } from '@phosphor-icons/react';
import { useCreateClient, useUpdateClient } from '@/shared/api/hooks/useClients';
import type { Client, ClientUpdatePayload, Sex } from '@/shared/api/types';
import { formatPrice, getClientInitials, SEX_OPTIONS } from '@/shared/lib/format';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { FormFieldGrid, FormModal, FormModalFooter, FormSection } from '@/shared/ui';
import {
  clientFormToPayload,
  clientToForm,
  emptyClientForm,
  type ClientFormState
} from '../lib/clientForm';

interface ClientFormModalProps {
  opened: boolean;
  client: Client | null;
  onClose: () => void;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({ opened, client, onClose }) => {
  const [form, setForm] = React.useState<ClientFormState>(emptyClientForm);
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  useResetOnOpen(opened, () => setForm(client ? clientToForm(client) : emptyClientForm()));

  const handleSubmit = React.useCallback(() => {
    if (client) {
      const payload: ClientUpdatePayload = { id: client.id, ...clientFormToPayload(form) };
      updateClient.mutate(payload, { onSuccess: onClose });
    } else {
      createClient.mutate(clientFormToPayload(form), { onSuccess: onClose });
    }
  }, [form, client, createClient, updateClient, onClose]);

  const isSaving = createClient.isPending || updateClient.isPending;

  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title={client ? 'Редактировать клиента' : 'Новый клиент'}
      subtitle={client ? 'Контактные данные и заметки' : 'Заполните контактные данные'}
      initials={client ? getClientInitials(client) : null}
      icon={<UserPlusIcon size={22} />}
      headerAside={
        client ? (
          <Badge variant='light' color='sage' size='lg' radius='sm'>
            {formatPrice(client.deposit)}
          </Badge>
        ) : undefined
      }
      size='lg'
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel={client ? 'Сохранить' : 'Создать'}
          onSubmit={handleSubmit}
          submitDisabled={!form.firstname}
          loading={isSaving}
        />
      }
    >
      <FormSection title='Основное'>
        <Stack gap='sm'>
          <FormFieldGrid>
            <TextInput
              label='Имя'
              required
              value={form.firstname}
              onChange={(e) => setForm({ ...form, firstname: e.currentTarget.value })}
            />
            <TextInput
              label='Фамилия'
              value={form.lastname}
              onChange={(e) => setForm({ ...form, lastname: e.currentTarget.value })}
            />
          </FormFieldGrid>
          <FormFieldGrid>
            <TextInput
              label='Отчество'
              value={form.middlename}
              onChange={(e) => setForm({ ...form, middlename: e.currentTarget.value })}
            />
            <Select
              label='Пол'
              required
              data={[...SEX_OPTIONS]}
              value={form.sex}
              onChange={(v) => setForm({ ...form, sex: (v as Sex) ?? 'female' })}
            />
          </FormFieldGrid>
        </Stack>
      </FormSection>

      <FormSection title='Контакты'>
        <FormFieldGrid>
          <TextInput
            label='Телефон'
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.currentTarget.value })}
          />
          <DateInput
            label='Дата рождения'
            clearable
            value={form.birth_date || null}
            onChange={(value) => setForm({ ...form, birth_date: value ?? '' })}
          />
        </FormFieldGrid>
      </FormSection>

      {!client && (
        <FormSection title='Депозит' hint='Стартовый баланс клиента на счёте салона'>
          <NumberInput
            label='Начальный депозит'
            min={0}
            value={form.deposit}
            onChange={(v) => setForm({ ...form, deposit: Number(v) || 0 })}
            thousandSeparator=' '
            suffix=' сум'
          />
        </FormSection>
      )}

      <FormSection title='Заметки' muted>
        <Textarea
          autosize
          minRows={3}
          placeholder='Предпочтения, аллергии, договорённости'
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.currentTarget.value })}
        />
      </FormSection>
    </FormModal>
  );
};
