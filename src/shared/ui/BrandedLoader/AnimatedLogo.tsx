import React from 'react';
import logoVideo from '@/shared/assets/Intro.mp4';
import styles from './animated-logo.module.css';

export const AnimatedLogo: React.FC = () => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    void video.play().catch(() => {
      // Autoplay may be blocked; muted + playsInline covers most cases.
    });
  }, []);

  return (
    <video
      ref={videoRef}
      className={styles.logo}
      src={logoVideo}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      disableRemotePlayback
      controls={false}
      tabIndex={-1}
      aria-hidden
    />
  );
};
