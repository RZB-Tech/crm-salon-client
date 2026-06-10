import React from 'react';
import {
  Group,
  Button,
  Table,
  Text,
  Badge,
  ActionIcon,
  Menu,
  Modal,
  Select,
  TextInput,
  Skeleton,
} from '@mantine/core';
import { Plus, DotsThree, PencilSimple, Trash } from '@phosphor-icons/react';
import { useEmployeePayments } from '@/shared/api/hooks/useEmployees';
import {
  useCreateSalary,
  useDeleteSalary,
  useUpdateSalary,
} from '@/shared/api/hooks/useSalary';
import type { CreateSalaryPayload, PatchedSalary, PaymentType, SalaryPayment } from '@/shared/api/types';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { formatPrice, PAYMENT_TYPE_LABELS, PAYMENT_TYPE_OPTIONS } from '@/shared/lib/format';
import styles from '../employee-profile.module.css';

interface PaymentsTabProps {
  employeeId: number;
}

export const PaymentsTab: React.FC<PaymentsTabProps> = ({ employeeId }) => {
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<SalaryPayment | null>(null);
  const [paymentType, setPaymentType] = React.useState<PaymentType>('salary');
  const [amount, setAmount] = React.useState('');
  const [note, setNote] = React.useState('');
  const [deleteTarget, setDeleteTarget] = React.useState<SalaryPayment | null>(null);

  const { data: payments, isLoading } = useEmployeePayments(employeeId);
  const createSalary = useCreateSalary();
  const updateSalary = useUpdateSalary();
  const deleteSalary = useDeleteSalary();

  const total = React.useMemo(
    () => (payments ?? []).reduce((sum, p) => sum + parseFloat(p.amount), 0),
    [payments],
  );

  const openCreate = React.useCallback(() => {
    setEditing(null);
    setPaymentType('salary');
    setAmount('');
    setNote('');
    setFormOpen(true);
  }, []);

  const openEdit = React.useCallback((payment: SalaryPayment) => {
    setEditing(payment);
    setPaymentType(payment.paymentType);
    setAmount(payment.amount);
    setNote(payment.note);
    setFormOpen(true);
  }, []);

  const submit = React.useCallback(() => {
    const payload: CreateSalaryPayload = { paymentType, amount, note, employee: employeeId };
    if (editing) {
      updateSalary.mutate(
        { id: editing.id, payload: payload as PatchedSalary },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createSalary.mutate(payload, { onSuccess: () => setFormOpen(false) });
    }
  }, [paymentType, amount, note, employeeId, editing, createSalary, updateSalary]);

  return (
    <div>
      <div className={styles.toolbar}>
        <Text fw={600}>
          Выплаты {payments && payments.length > 0 ? `· итого ${formatPrice(total)}` : ''}
        </Text>
        <Button size="sm" leftSection={<Plus size={15} />} onClick={openCreate}>
          Добавить выплату
        </Button>
      </div>

      {isLoading ? (
        <Skeleton height={160} radius="md" />
      ) : (
        <Table highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Тип</Table.Th>
              <Table.Th>Сумма</Table.Th>
              <Table.Th>Заметка</Table.Th>
              <Table.Th>Дата</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {(payments ?? []).length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text c="dimmed" ta="center" py="md">
                    Выплат пока нет
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              (payments ?? []).map((payment) => (
                <Table.Tr key={payment.id}>
                  <Table.Td>
                    <Badge size="sm" variant="light">
                      {PAYMENT_TYPE_LABELS[payment.paymentType] ?? payment.paymentType}
                    </Badge>
                  </Table.Td>
                  <Table.Td fw={600}>{formatPrice(payment.amount)}</Table.Td>
                  <Table.Td>{payment.note || '—'}</Table.Td>
                  <Table.Td>{new Date(payment.createdAt).toLocaleDateString('ru-RU')}</Table.Td>
                  <Table.Td>
                    <Menu shadow="sm" width={160} radius="md">
                      <Menu.Target>
                        <ActionIcon variant="subtle" color="gray" size="sm">
                          <DotsThree size={16} weight="bold" />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<PencilSimple size={14} />} onClick={() => openEdit(payment)}>
                          Редактировать
                        </Menu.Item>
                        <Menu.Item leftSection={<Trash size={14} />} color="red" onClick={() => setDeleteTarget(payment)}>
                          Удалить
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      )}

      <Modal
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Редактировать выплату' : 'Новая выплата'}
        radius="md"
      >
        <Select label="Тип выплаты" required data={PAYMENT_TYPE_OPTIONS} mb="md" value={paymentType} onChange={(v) => setPaymentType((v as PaymentType) ?? 'salary')} />
        <TextInput label="Сумма" required mb="md" value={amount} onChange={(e) => setAmount(e.currentTarget.value)} />
        <TextInput label="Заметка" mb="lg" value={note} onChange={(e) => setNote(e.currentTarget.value)} />
        <Group justify="flex-end">
          <Button variant="subtle" color="gray" onClick={() => setFormOpen(false)}>
            Отмена
          </Button>
          <Button onClick={submit} loading={createSalary.isPending || updateSalary.isPending} disabled={!amount}>
            Сохранить
          </Button>
        </Group>
      </Modal>

      <ConfirmModal
        opened={Boolean(deleteTarget)}
        title="Удалить выплату"
        message="Удалить эту выплату?"
        loading={deleteSalary.isPending}
        onConfirm={() => deleteTarget && deleteSalary.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
