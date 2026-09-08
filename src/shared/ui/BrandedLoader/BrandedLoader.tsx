import React from 'react';
import { Box } from '@mantine/core';
import { AnimatedLogo } from './AnimatedLogo';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { useI18n } from '@/shared/lib/i18n';
import splashLogo from '@/shared/assets/splash-logo.png';
import styles from './branded-loader.module.css';

const LINE_INTERVAL_MS = 1200;

interface BrandedLoaderProps {
  message?: string;
  exiting?: boolean;
}

export const BrandedLoader: React.FC<BrandedLoaderProps> = ({ exiting = false }) => {
  const { t } = useI18n();
  const isMobile = useIsMobile();
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
    if (isMobile) return undefined;

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
  }, [isMobile, statusLines.length]);

  if (isMobile) {
    return (
      <Box className={styles.root} data-exiting={exiting} data-mobile>
        <div className={styles.mobileStage}>
          <img src={splashLogo} alt="" className={styles.mark} width={180} height={180} />
          <p className={styles.status} aria-live="polite">
            {t('common.loaderReady')}
          </p>
        </div>
      </Box>
    );
  }

  return (
    <Box className={styles.root} data-exiting={exiting}>
      <AnimatedLogo />
      <p className={styles.status} data-visible={visible} aria-live="polite">
        {statusLines[lineIndex]}
      </p>
    </Box>
  );
};
