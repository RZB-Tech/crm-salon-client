import React from 'react';
import { ActionIcon, Badge, Button } from '@mantine/core';
import { UserListIcon, Users } from '@phosphor-icons/react';

interface EmployeeFilterTriggerProps {
  embedded: boolean;
  selectedCount: number;
  label: string;
  onClick: () => void;
  iconOnly?: boolean;
}

export const EmployeeFilterTrigger: React.FC<EmployeeFilterTriggerProps> = ({
  embedded,
  selectedCount,
  label,
  onClick,
  iconOnly = false,
}) => {
  if (iconOnly) {
    return (
      <ActionIcon
        variant={selectedCount > 0 ? 'light' : 'default'}
        color={selectedCount > 0 ? 'sage' : 'gray'}
        size={40}
        onClick={onClick}
        aria-label={label}
        aria-pressed={selectedCount > 0}
      >
        <UserListIcon size={20} />
      </ActionIcon>
    );
  }

  return (
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
};
