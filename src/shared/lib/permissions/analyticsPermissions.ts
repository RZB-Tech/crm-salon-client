import { PermissionCode, type PermissionCodeValue } from './codes';

/** Коды, с которыми пускаем на /analytics (роут, нав, хук страницы). */
export const ANALYTICS_PERMISSIONS: PermissionCodeValue[] = [
  PermissionCode.ANALYTICS_RECEIPT,
  PermissionCode.ANALYTICS_APPOINTMENT,
  PermissionCode.ANALYTICS_TRANSACTION,
  PermissionCode.ANALYTICS_EMPLOYEE,
  PermissionCode.ANALYTICS_SERVICE,
  PermissionCode.ANALYTICS_MANAGE,
];
