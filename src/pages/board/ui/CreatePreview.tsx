import React from 'react';
import { Text } from '@mantine/core';
import type { CreatePreviewState } from '../hooks/useCreateAppointmentDrag';
import styles from './board-page.module.css';

interface CreatePreviewProps {
  preview: CreatePreviewState;
}

export const CreatePreview: React.FC<CreatePreviewProps> = ({ preview }) => (
  <div
    className={`${styles.createPreview} ${preview.conflict ? styles.createPreview_conflict : styles.createPreview_ok}`}
    style={{ top: preview.top, height: preview.height }}
  >
    <Text size="xs" fw={600} className={styles.createPreviewText}>
      Записать +
    </Text>
  </div>
);
