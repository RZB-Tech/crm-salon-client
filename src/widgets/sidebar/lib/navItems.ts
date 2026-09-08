import type { ElementType } from 'react';
import {
  BuildingsIcon,
  CalendarCheckIcon,
  ChartLineUpIcon,
  CurrencyCircleDollarIcon,
  GearSixIcon,
  PackageIcon,
  ScissorsIcon,
  ShieldCheckIcon,
  SquaresFourIcon,
  TagIcon,
  TicketIcon,
  UserListIcon,
  UsersIcon,
  BellIcon,
} from '@phosphor-icons/react';
import { ANALYTICS_PERMISSIONS, PermissionCode, type PermissionCodeValue } from '@/shared/lib/permissions';

export interface NavItem {
  path: string;
  labelKey: string;
  Icon: ElementType;
  permissions?: PermissionCodeValue[];
  adminOnly?: boolean;
  parentTenantOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    path: '/board',
    labelKey: 'nav.board',
    Icon: SquaresFourIcon,
    permissions: [PermissionCode.APPOINTMENT_READ, PermissionCode.APPOINTMENT_MANAGE],
  },
  {
    path: '/appointments',
    labelKey: 'nav.appointments',
    Icon: CalendarCheckIcon,
    permissions: [PermissionCode.APPOINTMENT_READ, PermissionCode.APPOINTMENT_MANAGE],
  },
  {
    path: '/clients',
    labelKey: 'nav.clients',
    Icon: UsersIcon,
    permissions: [PermissionCode.CLIENT_READ, PermissionCode.CLIENT_MANAGE],
  },
  {
    path: '/services',
    labelKey: 'nav.services',
    Icon: ScissorsIcon,
    permissions: [PermissionCode.SERVICE_READ, PermissionCode.SERVICE_MANAGE],
  },
  {
    path: '/promotions',
    labelKey: 'nav.promotions',
    Icon: TagIcon,
    permissions: [PermissionCode.PROMOTION_GET, PermissionCode.PROMOTION_MANAGE],
  },
  {
    path: '/gift-cards',
    labelKey: 'nav.giftCards',
    Icon: TicketIcon,
    permissions: [PermissionCode.GIFT_CARD_GET, PermissionCode.GIFT_CARD_MANAGE],
  },
  {
    path: '/employees',
    labelKey: 'nav.employees',
    Icon: UserListIcon,
    permissions: [PermissionCode.EMPLOYEE_READ, PermissionCode.EMPLOYEE_MANAGE],
  },
  {
    path: '/materials',
    labelKey: 'nav.materials',
    Icon: PackageIcon,
    permissions: [PermissionCode.MATERIAL_READ, PermissionCode.MATERIAL_MANAGE],
  },
  {
    path: '/finance',
    labelKey: 'nav.finance',
    Icon: CurrencyCircleDollarIcon,
    permissions: [
      PermissionCode.RECEIPT_READ,
      PermissionCode.RECEIPT_MANAGE,
      PermissionCode.PAYROLL_READ,
      PermissionCode.PAYROLL_MANAGE,
      PermissionCode.TRANSACTION_READ,
      PermissionCode.TRANSACTION_MANAGE,
    ],
  },
  {
    path: '/analytics',
    labelKey: 'nav.analytics',
    Icon: ChartLineUpIcon,
    permissions: ANALYTICS_PERMISSIONS,
  },
  {
    path: '/notifications',
    labelKey: 'nav.notifications',
    Icon: BellIcon,
    permissions: [PermissionCode.NOTIFICATION_READ, PermissionCode.NOTIFICATION_MANAGE],
  },
  {
    path: '/settings',
    labelKey: 'nav.settings',
    Icon: GearSixIcon,
    permissions: [PermissionCode.TENANT_PREFERENCES_READ, PermissionCode.TENANT_MANAGE],
  },
  {
    path: '/branches',
    labelKey: 'nav.branches',
    Icon: BuildingsIcon,
    permissions: [
      PermissionCode.TENANT_BRANCH_READ,
      PermissionCode.TENANT_BRANCH_MANAGE,
      PermissionCode.TENANT_MANAGE,
    ],
    parentTenantOnly: true,
  },
  { path: '/admin', labelKey: 'nav.admin', Icon: ShieldCheckIcon, adminOnly: true },
];
