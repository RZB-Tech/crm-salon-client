import React from 'react';
import { Modal, type ModalProps } from '@mantine/core';
import { FormModalHeader, type FormModalTone } from './FormModalHeader';
import styles from './form-modal.module.css';

export interface FormModalProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  subtitle?: React.ReactNode;
  /** Инициалы в аватаре; если не заданы — рисуется icon */
  initials?: string | null;
  icon?: React.ReactNode;
  tone?: FormModalTone;
  /** Бейджи/контролы справа от заголовка */
  headerAside?: React.ReactNode;
  /** Ряд бейджей под заголовком */
  badges?: React.ReactNode;
  /** Липкий футер — обычно <FormModalFooter /> */
  footer?: React.ReactNode;
  size?: ModalProps['size'];
  children: React.ReactNode;
}

export const FormModal: React.FC<FormModalProps> = ({
  opened,
  onClose,
  title,
  subtitle,
  initials,
  icon,
  tone,
  headerAside,
  badges,
  footer,
  size = 567,
  children,
}) => {
  const stackId = React.useId();
  const [renderKey, setRenderKey] = React.useState(0);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      stackId={stackId}
      withCloseButton={false}
      title={null}
      radius="md"
      shadow="sm"
      size={size}
      padding={0}
      overlayProps={{ backgroundOpacity: 0.08, blur: 3 }}
      classNames={{ content: styles.modalShell }}
      transitionProps={{
        transition: 'pop',
        duration: 220,
        onEntered: () => setRenderKey((key) => key + 1),
      }}
    >
      <div className={styles.modalBody} key={renderKey}>
        <FormModalHeader
          title={title}
          subtitle={subtitle}
          initials={initials}
          icon={icon}
          tone={tone}
          aside={headerAside}
          onClose={onClose}
        />

        {badges != null && <div className={styles.badgeRow}>{badges}</div>}

        <div className={styles.content} data-no-footer={footer == null}>
          {children}
        </div>

        {footer}
      </div>
    </Modal>
  );
};
