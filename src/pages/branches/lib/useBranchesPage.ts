import React from 'react';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { sortTime, useTableSort } from '@/shared/lib/hooks/useTableSort';
import { useTenantBranches } from '@/shared/api/hooks/useTenantBranches';
import type { TenantBranch } from '@/shared/api/types';
import type { BranchFilter } from './branchForm';

const SORT_GETTERS = {
  name: (item: TenantBranch) => item.name,
  tin: (item: TenantBranch) => item.TIN,
  status: (item: TenantBranch) => Number(item.active),
  created: (item: TenantBranch) => sortTime(item.created_at),
};

export const useBranchesPage = () => {
  const [tab, setTab] = React.useState<'list' | 'report'>('list');
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState<BranchFilter>('all');
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<TenantBranch | null>(null);
  const [adminTarget, setAdminTarget] = React.useState<TenantBranch | null>(null);

  const { data, isLoading, isError } = useTenantBranches();
  const branches = data?.branches ?? [];
  const isParent = data?.isParent ?? false;

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return branches.filter((item) => {
      if (filter === 'active' && !item.active) return false;
      if (filter === 'inactive' && item.active) return false;
      if (!query) return true;
      const tin = item.TIN?.toLowerCase() ?? '';
      return item.name.toLowerCase().includes(query) || tin.includes(query);
    });
  }, [branches, filter, search]);

  const { sort, sortedItems, toggleSort } = useTableSort(filtered, SORT_GETTERS, {
    key: 'name',
    dir: 'asc',
  });
  const pagination = usePagination(sortedItems, { defaultPageSize: 20 });

  return {
    tab,
    setTab,
    search,
    setSearch,
    filter,
    setFilter,
    createOpen,
    setCreateOpen,
    editing,
    setEditing,
    adminTarget,
    setAdminTarget,
    isLoading,
    isError,
    isParent,
    sort,
    toggleSort,
    pagination,
  };
};
