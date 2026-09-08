import React from 'react';
import { Drawer, Modal, type ModalProps } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { FormModalHeader, type FormModalTone } from './FormModalHeader';
import styles from './form-modal.module.css';

const SheetScrollArea: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>{children}</>;

const MOBILE_QUERY = '(max-width: 47.99em)';

const getIsMobile = (): boolean =>
  typeof window !== 'undefined' ? window.matchMedia(MOBILE_QUERY).matches : false;

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
  const isMobile = useMediaQuery(MOBILE_QUERY, getIsMobile(), { getInitialValueInEffect: false });
  const [renderKey, setRenderKey] = React.useState(0);

  const handleEntered = React.useCallback(() => {
    setRenderKey((key) => key + 1);
  }, []);

  const inner = (
    <>
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
    </>
  );

  const body = (
    <div
      className={`${styles.modalBody}${isMobile ? ` ${styles.sheetFill}` : ''}`}
      key={renderKey}
    >
      {isMobile && <div className={styles.handle} />}
      {isMobile ? <div className={styles.sheetScroll}>{inner}</div> : inner}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer
        opened={opened}
        onClose={onClose}
        position="bottom"
        size="84%"
        radius={24}
        padding={0}
        withCloseButton={false}
        scrollAreaComponent={SheetScrollArea}
        overlayProps={{
          backgroundOpacity: 0.5,
          blur: 4,
          transitionProps: { duration: 380, timingFunction: 'ease-out' },
        }}
        classNames={{ content: styles.sheetShell, body: styles.sheetDrawerBody }}
        styles={{
          content: {
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
          body: { flex: 1, minHeight: 0, height: '100%', overflow: 'hidden', padding: 0 },
        }}
        transitionProps={{
          duration: 420,
          timingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          onEntered: handleEntered,
        }}
      >
        {body}
      </Drawer>
    );
  }

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
        onEntered: handleEntered,
      }}
    >
      {body}
    </Modal>
  );
};
