import React from 'react';
import { Avatar, type MantineSize } from '@mantine/core';
import styles from './person-avatar.module.css';

interface PersonAvatarProps {
  seed?: number;
  initials: string;
  size?: MantineSize | 'profile';
  selected?: boolean;
  muted?: boolean;
  onClick?: () => void;
  className?: string;
}

const SIZE_MAP: Record<string, MantineSize | number> = {
  xs: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'lg',
  profile: 64,
};

export const PersonAvatar: React.FC<PersonAvatarProps> = ({
  initials,
  size = 'md',
  selected = false,
  muted = false,
  onClick,
  className,
}) => {
  const mantineSize = SIZE_MAP[size] ?? 'md';

  const cls = [
    styles.avatar,
    onClick ? styles.clickable : '',
    muted ? styles.muted : '',
    selected ? styles.selected : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Avatar
      radius='md'
      size={mantineSize}
      color='sage'
      className={cls}
      onClick={onClick}
    >
      {initials}
    </Avatar>
  );
};
