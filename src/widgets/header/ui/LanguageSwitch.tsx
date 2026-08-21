import { Button, Menu } from '@mantine/core';
import { CaretDownIcon, CheckIcon, GlobeIcon } from '@phosphor-icons/react';
import { LOCALES, LOCALE_LABELS, useI18n } from '@/shared/lib/i18n';

export function LanguageSwitch() {
  const { locale, setLocale, t } = useI18n();

  return (
    <Menu shadow="md" width={180} position="bottom-end" radius="md" offset={8} withinPortal>
      <Menu.Target>
        <Button
          variant="default"
          size="compact-sm"
          radius="md"
          leftSection={<GlobeIcon size={16} />}
          rightSection={<CaretDownIcon size={12} />}
          aria-label={t('lang.switch')}
        >
          {LOCALE_LABELS[locale]}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
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
