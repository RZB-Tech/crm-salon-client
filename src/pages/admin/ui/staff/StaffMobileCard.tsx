import React from 'react';
import type { Staff } from '@/shared/api/types';
import { ListCardField, ListEntityCard, listPageStyles } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';

interface StaffMobileCardProps {
  staff: Staff;
  onSelect: (staff: Staff) => void;
}

export const StaffMobileCard: React.FC<StaffMobileCardProps> = ({ staff, onSelect }) => {
  const { t } = useI18n();
  const roles =
    staff.roles.length > 0 ? staff.roles.map((role) => role.name).join(', ') : t('common.dash');
  const statusClass = staff.active ? listPageStyles.cardChipSuccess : listPageStyles.cardChipMuted;

  return (
    <ListEntityCard onClick={() => onSelect(staff)}>
      <div className={listPageStyles.cardHeader}>
        <div className={listPageStyles.cardBadges}>
          <span className={`${listPageStyles.cardChip} ${statusClass}`}>
            {staff.active ? t('form.staffActive') : t('form.staffInactive')}
          </span>
        </div>
      </div>
      <div className={listPageStyles.cardFields}>
        <ListCardField label={t('common.login')} value={staff.login} />
        <ListCardField
          label={t('common.firstName')}
          value={[staff.firstname, staff.lastname].filter(Boolean).join(' ') || t('common.dash')}
        />
        <ListCardField label={t('admin.roles')} value={roles} />
      </div>
    </ListEntityCard>
  );
};
