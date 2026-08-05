import type { Permission } from '@/shared/api/types';

export function groupPermissionsByResource(
  permissions: Permission[] | undefined,
): Record<string, Permission[]> {
  if (!permissions) return {};
  return permissions.reduce<Record<string, Permission[]>>((acc, p) => {
    if (!acc[p.resource]) acc[p.resource] = [];
    acc[p.resource].push(p);
    return acc;
  }, {});
}

export function toggleCodeInList(codes: number[], code: number): number[] {
  return codes.includes(code) ? codes.filter((c) => c !== code) : [...codes, code];
}

export function toggleResourceCodes(selected: number[], codes: number[]): number[] {
  const allSelected = codes.every((c) => selected.includes(c));
  if (allSelected) {
    const codesSet = new Set(codes);
    return selected.filter((c) => !codesSet.has(c));
  }
  return [...new Set([...selected, ...codes])];
}

export function toggleExpandedResource(prev: Set<string>, resource: string): Set<string> {
  const next = new Set(prev);
  if (next.has(resource)) next.delete(resource);
  else next.add(resource);
  return next;
}
