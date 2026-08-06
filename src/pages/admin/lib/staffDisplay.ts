import type { Staff } from '@/shared/api/types';

export const getStaffFullName = (staff: Staff) =>
  [staff.firstname, staff.middlename, staff.lastname].filter(Boolean).join(' ') || staff.login;

export const getStaffInitials = (staff: Staff) =>
  [staff.firstname?.[0], staff.lastname?.[0]].filter(Boolean).join('').toUpperCase() || null;
