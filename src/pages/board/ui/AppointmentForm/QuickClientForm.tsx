import React from 'react';
import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { Plus } from '@phosphor-icons/react';
import { useCreateClient } from '@/shared/api/hooks/useClients';

interface QuickClientFormProps {
  onCreated: (clientId: string) => void;
}

export const QuickClientForm: React.FC<QuickClientFormProps> = ({ onCreated }) => {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const createClient = useCreateClient();

  const reset = React.useCallback(() => {
    setOpen(false);
    setName('');
    setPhone('');
  }, []);

  const handleCreate = React.useCallback(() => {
    createClient.mutate(
      {
        firstname: name.trim(),
        phone: phone.trim() || undefined,
        sex: 'female' as const,
      },
      {
        onSuccess: (created) => {
          onCreated(String(created.id));
          reset();
        },
      },
    );
  }, [name, phone, createClient, onCreated, reset]);

  if (!open) {
    return (
      <Button variant="light" size="sm" leftSection={<Plus size={14} />} onClick={() => setOpen(true)}>
        Новый
      </Button>
    );
  }

  return (
    <Stack gap="xs">
      <Text size="sm" fw={600}>Новый клиент</Text>
      <Group grow>
        <TextInput
          label="Имя"
          required
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          placeholder="Имя клиента"
        />
        <TextInput
          label="Телефон"
          value={phone}
          onChange={(event) => setPhone(event.currentTarget.value)}
          placeholder="+7..."
        />
      </Group>
      <Group gap="xs">
        <Button size="xs" disabled={!name.trim()} loading={createClient.isPending} onClick={handleCreate}>
          Создать
        </Button>
        <Button size="xs" variant="subtle" color="gray" onClick={reset}>
          Отмена
        </Button>
      </Group>
    </Stack>
  );
};
