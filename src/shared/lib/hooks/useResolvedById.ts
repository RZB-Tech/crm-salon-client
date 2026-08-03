import React from 'react';

/** Актуальная сущность из списка по id — чтобы модалки не залипали на snapshot. */
export const useResolvedById = <T extends { id: number }>(
  list: T[] | undefined,
  id: number | null,
): T | null =>
  React.useMemo(
    () => (id == null ? null : (list ?? []).find((item) => item.id === id) ?? null),
    [list, id],
  );
