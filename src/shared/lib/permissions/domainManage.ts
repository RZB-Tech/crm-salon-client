import { PermissionCode } from './codes';

const buildDomainManageMap = (): Map<number, number> => {
  const entries = Object.entries(PermissionCode) as [string, number][];
  const manageCodes = entries.filter(([name]) => name.endsWith('_MANAGE'));
  const domainMap = new Map<number, number>();

  for (const [name, code] of entries) {
    if (name.endsWith('_MANAGE')) continue;

    const codeParts = name.split('_');
    let bestMatch: number | undefined;
    let bestMatchLen = 0;

    for (const [manageName, manageCode] of manageCodes) {
      const manageParts = manageName.replace(/_MANAGE$/, '').split('_');
      if (
        manageParts.length > bestMatchLen &&
        codeParts.slice(0, manageParts.length).join('_') === manageParts.join('_')
      ) {
        bestMatch = manageCode;
        bestMatchLen = manageParts.length;
      }
    }

    if (bestMatch != null) domainMap.set(code, bestMatch);
  }

  return domainMap;
};

const PERMISSION_DOMAIN_MANAGE = buildDomainManageMap();

export const hasEffectivePermission = (permissions: number[], code: number): boolean => {
  if (permissions.includes(code)) return true;
  const manageCode = PERMISSION_DOMAIN_MANAGE.get(code);
  return manageCode != null && permissions.includes(manageCode);
};
