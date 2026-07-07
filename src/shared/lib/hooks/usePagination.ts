import React from 'react';

interface UsePaginationOptions {
  defaultPageSize?: number;
}

interface UsePaginationResult<T> {
  page: number;
  pageSize: number;
  paginatedItems: T[];
  total: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  resetPage: () => void;
}

export const usePagination = <T>(
  items: T[],
  options: UsePaginationOptions = {},
): UsePaginationResult<T> => {
  const { defaultPageSize = 25 } = options;
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSizeState] = React.useState(defaultPageSize);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Сбрасываем страницу если она вышла за пределы
  const safePage = React.useMemo(
    () => Math.min(page, totalPages),
    [page, totalPages],
  );

  React.useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedItems = React.useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  const setPageSize = React.useCallback((size: number) => {
    setPageSizeState(size);
    setPage(1);
  }, []);

  const resetPage = React.useCallback(() => setPage(1), []);

  return {
    page: safePage,
    pageSize,
    paginatedItems,
    total,
    setPage,
    setPageSize,
    resetPage,
  };
};
