type MessageLeaf = string;
export type MessageTree = { [key: string]: MessageLeaf | MessageTree };

const getByPath = (tree: MessageTree, path: string): string | undefined => {
  const parts = path.split('.');
  let current: MessageLeaf | MessageTree | undefined = tree;
  for (const part of parts) {
    if (current == null || typeof current === 'string') return undefined;
    current = current[part];
  }
  return typeof current === 'string' ? current : undefined;
};

export const interpolate = (template: string, vars?: Record<string, string | number>): string => {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    vars[name] == null ? `{${name}}` : String(vars[name]),
  );
};

export const lookupMessage = (
  tree: MessageTree,
  fallback: MessageTree,
  key: string,
  vars?: Record<string, string | number>,
): string => {
  const raw = getByPath(tree, key) ?? getByPath(fallback, key) ?? key;
  return interpolate(raw, vars);
};
