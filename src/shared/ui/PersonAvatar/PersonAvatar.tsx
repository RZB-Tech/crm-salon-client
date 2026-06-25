import React from 'react';
import { getEmployeeColor } from '@/shared/lib/format';
import styles from './person-avatar.module.css';

type PersonAvatarSize = 'xs' | 'xl' | 'md' | 'lg' | 'profile';

interface PersonAvatarProps {
  seed: number;
  initials: string;
  size?: PersonAvatarSize;
  selected?: boolean;
  muted?: boolean;
  onClick?: () => void;
  className?: string;
}

const SIZE_CLASS: Record<PersonAvatarSize, string> = {
  xs: styles.personAvatar_xs,
  xl: styles.personAvatar_xl,
  md: styles.personAvatar_md,
  lg: styles.personAvatar_lg,
  profile: styles.personAvatar_profile,
};

export const PersonAvatar: React.FC<PersonAvatarProps> = ({
  seed,
  initials,
  size = 'md',
  selected = false,
  muted = false,
  onClick,
  className,
}) => {
  const color = getEmployeeColor(seed);

  return (
    <span
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={[
        styles.personAvatar,
        SIZE_CLASS[size],
        onClick ? styles.personAvatar_clickable : '',
        selected ? styles.personAvatar_selected : '',
        muted ? styles.personAvatar_muted : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ backgroundColor: color }}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {initials}
    </span>
  );
};
