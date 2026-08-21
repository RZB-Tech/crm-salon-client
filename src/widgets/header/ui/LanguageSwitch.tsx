import { Menu, UnstyledButton } from '@mantine/core';
import { CaretDownIcon, CheckIcon, GlobeIcon } from '@phosphor-icons/react';
import { LOCALES, LOCALE_LABELS, useI18n } from '@/shared/lib/i18n';
import styles from './language-switch.module.css';

export function LanguageSwitch() {
  const { locale, setLocale, t } = useI18n();

  return (
    <Menu shadow="md" width={180} position="bottom-end" radius="md" offset={8} withinPortal>
      <Menu.Target>
        <UnstyledButton className={styles.trigger} aria-label={t('lang.switch')}>
          <GlobeIcon size={16} weight="regular" />
          <span className={styles.code}>{LOCALE_LABELS[locale]}</span>
          <CaretDownIcon size={12} className={styles.caret} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown className={styles.dropdown}>
        <Menu.Label>{t('lang.switch')}</Menu.Label>
        {LOCALES.map((item) => (
          <Menu.Item
            key={item}
            rightSection={locale === item ? <CheckIcon size={14} /> : null}
            onClick={() => setLocale(item)}
          >
            {LOCALE_LABELS[item]}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
