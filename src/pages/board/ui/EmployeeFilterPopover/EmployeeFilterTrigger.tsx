import React from 'react';
import { Badge, Button } from '@mantine/core';
import { Users } from '@phosphor-icons/react';

interface EmployeeFilterTriggerProps {
  embedded: boolean;
  selectedCount: number;
  label: string;
  onClick: () => void;
}

export const EmployeeFilterTrigger: React.FC<EmployeeFilterTriggerProps> = ({
  embedded,
  selectedCount,
  label,
  onClick,
}) => (
  <Button
    variant={
      embedded
        ? selectedCount > 0
          ? 'light'
          : 'subtle'
        : selectedCount > 0
          ? 'light'
          : 'default'
    }
    color={selectedCount > 0 ? 'sage' : 'gray'}
    size="sm"
    leftSection={<Users size={16} />}
    rightSection={
      selectedCount > 0 ? (
        <Badge size="xs" variant="filled" circle>
          {selectedCount}
        </Badge>
      ) : undefined
    }
    onClick={onClick}
  >
    {label}
  </Button>
);
