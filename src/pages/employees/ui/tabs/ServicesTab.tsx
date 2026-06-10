import React from 'react';
import { Group, Button, MultiSelect, Text, Badge, Skeleton } from '@mantine/core';
import { useServices } from '@/shared/api/hooks/useServices';
import { useUpdateEmployee } from '@/shared/api/hooks/useEmployees';
import type { Employee } from '@/shared/api/types';
import { ensureArray } from '@/shared/lib/format';
import styles from '../employee-profile.module.css';

interface ServicesTabProps {
  employee: Employee;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({ employee }) => {
  const { data: services, isLoading } = useServices();
  const updateEmployee = useUpdateEmployee();

  const [selected, setSelected] = React.useState<string[]>(() =>
    ensureArray<number>(employee.services).map(String),
  );

  React.useEffect(() => {
    setSelected(ensureArray<number>(employee.services).map(String));
  }, [employee.services]);

  const serviceOptions = React.useMemo(
    () => (services ?? []).map((s) => ({ value: String(s.id), label: s.name })),
    [services],
  );

  const serviceNameById = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const s of services ?? []) map.set(String(s.id), s.name);
    return map;
  }, [services]);

  const isDirty = React.useMemo(() => {
    const current = ensureArray<number>(employee.services).map(String).sort().join(',');
    return selected.slice().sort().join(',') !== current;
  }, [selected, employee.services]);

  const handleSave = React.useCallback(() => {
    updateEmployee.mutate({ id: employee.id, payload: { services: selected.map(Number) } });
  }, [updateEmployee, employee.id, selected]);

  if (isLoading) {
    return <Skeleton height={160} radius="md" />;
  }

  return (
    <div>
      <div className={styles.toolbar}>
        <Text fw={600}>Услуги и специализация</Text>
        <Button size="sm" onClick={handleSave} loading={updateEmployee.isPending} disabled={!isDirty}>
          Сохранить
        </Button>
      </div>

      <MultiSelect
        label="Назначенные услуги"
        placeholder="Выберите услуги"
        data={serviceOptions}
        value={selected}
        onChange={setSelected}
        searchable
        clearable
        mb="md"
      />

      {selected.length > 0 && (
        <Group gap={6}>
          {selected.map((id) => (
            <Badge key={id} variant="light" radius="sm">
              {serviceNameById.get(id) ?? `ID ${id}`}
            </Badge>
          ))}
        </Group>
      )}
    </div>
  );
};
