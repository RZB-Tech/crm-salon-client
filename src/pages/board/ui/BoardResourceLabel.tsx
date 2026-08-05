import React from 'react';
import { Avatar, Box, Text, Tooltip } from '@mantine/core';
import type { Employee } from '@/shared/api/types';
import { getEmployeeInitials } from '@/shared/lib/format';
import { LABEL_TOOLTIP_BELOW } from './boardScheduleTypes';
import styles from './board-page.module.css';

interface BoardResourceLabelProps {
  label: string;
  resourceId: number;
  labelWidth: number;
  employees: Employee[];
}

export const BoardResourceLabel: React.FC<BoardResourceLabelProps> = ({
  label,
  resourceId,
  labelWidth,
  employees,
}) => {
  const isNarrow = labelWidth < LABEL_TOOLTIP_BELOW;
  const employee = employees.find((e) => e.id === resourceId);

  const labelContent = (
    <Box className={styles.resourceLabel}>
      <Avatar size="sm" radius="md" color="sage">
        {getEmployeeInitials(
          employee ?? {
            firstname: String(label).charAt(0),
            lastname: '',
          },
        )}
      </Avatar>
      <Box className={styles.resourceLabelText}>
        <Text size="sm" fw={500} lineClamp={1}>
          {label}
        </Text>
        {!isNarrow && (
          <Text size="xs" c="dimmed" lineClamp={1}>
            Сотрудник
          </Text>
        )}
      </Box>
    </Box>
  );

  if (!isNarrow) return labelContent;

  return (
    <Tooltip label={label} withArrow position="right" openDelay={300}>
      {labelContent}
    </Tooltip>
  );
};
