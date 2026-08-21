import React from 'react';
import { Box } from '@mantine/core';
import { AnimatedLogo } from './AnimatedLogo';
import { useI18n } from '@/shared/lib/i18n';
import styles from './branded-loader.module.css';

const LINE_INTERVAL_MS = 1200;

interface BrandedLoaderProps {
  message?: string;
  exiting?: boolean;
}

export const BrandedLoader: React.FC<BrandedLoaderProps> = ({ exiting = false }) => {
  const { t } = useI18n();
  const statusLines = [
    t('common.loaderEmployees'),
    t('common.loaderBoard'),
    t('common.loaderClients'),
    t('common.loaderSchedule'),
    t('common.loaderReady'),
  ];
  const [lineIndex, setLineIndex] = React.useState(0);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    let fadeTimer: number | undefined;

    const timer = window.setInterval(() => {
      setVisible(false);
      fadeTimer = window.setTimeout(() => {
        setLineIndex((prev) => (prev + 1) % statusLines.length);
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
        {statusLines[lineIndex]}
      </p>
    </Box>
  );
};
