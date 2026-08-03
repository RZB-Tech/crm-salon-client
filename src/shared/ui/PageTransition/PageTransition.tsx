import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './page-transition.module.css';

interface PageTransitionProps {
  children: React.ReactNode;
}

/** Fade + slight rise on route change. Remounts via location key. */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div key={location.pathname} className={styles.enter}>
      {children}
    </div>
  );
};
