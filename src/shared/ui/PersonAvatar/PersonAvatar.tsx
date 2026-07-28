import React from 'react';
import { Avatar, type MantineSize } from '@mantine/core';

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

  return (
    <Avatar
      radius='md'
      size={mantineSize}
      color='sage'
      className={className}
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : undefined,
        opacity: muted ? 0.5 : 1,
        outline: selected ? '2px solid var(--mantine-color-sage-5)' : undefined,
        outlineOffset: selected ? '2px' : undefined,
      }}
    >
      {initials}
    </Avatar>
  );
};
