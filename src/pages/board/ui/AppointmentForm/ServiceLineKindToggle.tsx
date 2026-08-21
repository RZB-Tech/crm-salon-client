import React from 'react';
import { SegmentedControl } from '@mantine/core';
import { PackageIcon, ScissorsIcon } from '@phosphor-icons/react';
import type { LineKind } from '../../lib/appointmentForm';
import { useI18n } from '@/shared/lib/i18n';
import styles from './appointment-form-modal.module.css';

interface ServiceLineKindToggleProps {
  kind: LineKind;
  readOnly: boolean;
  onKindChange: (kind: LineKind) => void;
}

const kindItem = (icon: React.ReactNode, label: string) => (
  <span className={styles.kindItem}>
    {icon}
    {label}
  </span>
);

export const ServiceLineKindToggle: React.FC<ServiceLineKindToggleProps> = ({
  kind,
  readOnly,
  onKindChange,
}) => {
  const { t } = useI18n();
  return (
  <SegmentedControl
    size="xs"
    radius="xs"
    classNames={{
      root: styles.kindToggle,
      indicator: styles.kindIndicator,
      label: styles.kindLabel,
    }}
    data={[
      { value: 'service', label: kindItem(<ScissorsIcon size={12} />, t('form.service')) },
      { value: 'material', label: kindItem(<PackageIcon size={12} />, t('form.product')) },
    ]}
    value={kind}
    onChange={(value) => onKindChange(value as LineKind)}
    disabled={readOnly}
  />
  );
};
