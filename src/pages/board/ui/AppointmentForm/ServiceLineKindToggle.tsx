import React from 'react';
import { Center, SegmentedControl, Tooltip } from '@mantine/core';
import { Package, Scissors } from '@phosphor-icons/react';
import type { LineKind } from '../../lib/appointmentForm';
import styles from './appointment-form-modal.module.css';

interface ServiceLineKindToggleProps {
  kind: LineKind;
  readOnly: boolean;
  onKindChange: (kind: LineKind) => void;
}

export const ServiceLineKindToggle: React.FC<ServiceLineKindToggleProps> = ({
  kind,
  readOnly,
  onKindChange,
}) => (
  <SegmentedControl
    size="sm"
    radius="md"
    className={styles.kindToggle}
    data={[
      {
        value: 'service',
        label: (
          <Tooltip label="Услуга" openDelay={300}>
            <Center h={20}>
              <Scissors size={16} />
            </Center>
          </Tooltip>
        ),
      },
      {
        value: 'material',
        label: (
          <Tooltip label="Товар" openDelay={300}>
            <Center h={20}>
              <Package size={16} />
            </Center>
          </Tooltip>
        ),
      },
    ]}
    value={kind}
    onChange={(value) => onKindChange(value as LineKind)}
    disabled={readOnly}
  />
);
