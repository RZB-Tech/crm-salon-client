import React from 'react';
import styles from './form-modal.module.css';

export interface FormSectionProps {
  title?: React.ReactNode;
  /** Пояснение под заголовком секции */
  hint?: React.ReactNode;
  /** Контрол справа от заголовка (например, переключатель) */
  aside?: React.ReactNode;
  /** Приглушённая карточка — для второстепенных блоков (заметки, история) */
  muted?: boolean;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, hint, aside, muted, children }) => {
  const heading = (title != null || hint != null) && (
    <div className={styles.sectionHeading}>
      {title != null && (
        <p className={muted ? styles.sectionTitleMuted : styles.sectionTitle}>{title}</p>
      )}
      {hint != null && <p className={styles.sectionHint}>{hint}</p>}
    </div>
  );

  return (
    <section className={muted ? styles.sectionCardMuted : styles.sectionCard}>
      {(heading || aside != null) &&
        (aside != null ? (
          <div className={styles.sectionHeadingRow}>
            {heading}
            {aside}
          </div>
        ) : (
          heading
        ))}
      {children}
    </section>
  );
};

export interface FormFieldGridProps {
  /** Число колонок на десктопе (на мобильном всегда одна) */
  cols?: number;
  children: React.ReactNode;
}

export const FormFieldGrid: React.FC<FormFieldGridProps> = ({ cols = 2, children }) => (
  <div className={styles.fieldGrid} style={{ '--form-modal-cols': cols } as React.CSSProperties}>
    {children}
  </div>
);
