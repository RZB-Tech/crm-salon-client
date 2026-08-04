import React from 'react';
import { Box } from '@mantine/core';
import { AnimatedLogo } from './AnimatedLogo';
import styles from './branded-loader.module.css';

const STATUS_LINES = [
  'Загружаем сотрудников',
  'Собираем рабочий стол',
  'Загружаем клиентов',
  'Настраиваем расписание',
  'Готовим салон к работе',
] as const;

const LINE_INTERVAL_MS = 1200;

interface BrandedLoaderProps {
  message?: string;
  exiting?: boolean;
}

export const BrandedLoader: React.FC<BrandedLoaderProps> = ({ exiting = false }) => {
  const [lineIndex, setLineIndex] = React.useState(0);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    let fadeTimer: number | undefined;

    const timer = window.setInterval(() => {
      setVisible(false);
      fadeTimer = window.setTimeout(() => {
        setLineIndex((prev) => (prev + 1) % STATUS_LINES.length);
        setVisible(true);
      }, 220);
    }, LINE_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
      if (fadeTimer) window.clearTimeout(fadeTimer);
    };
  }, []);

  return (
    <Box className={styles.root} data-exiting={exiting}>
      <AnimatedLogo />
      <p className={styles.status} data-visible={visible} aria-live="polite">
        {STATUS_LINES[lineIndex]}
      </p>
    </Box>
  );
};
