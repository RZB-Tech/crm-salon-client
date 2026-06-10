export const queryKeys = {
  clients: {
    all: ['clients'] as const,
    detail: (id: number) => ['clients', id] as const,
  },
  employees: {
    all: ['employees'] as const,
    detail: (id: number) => ['employees', id] as const,
    payments: (id: number) => ['employees', id, 'payments'] as const,
    schedules: (id: number) => ['employees', id, 'schedules'] as const,
    financeReport: (id: number, dateFrom?: string, dateTo?: string) =>
      ['employees', id, 'finance-report', dateFrom ?? '', dateTo ?? ''] as const,
  },
  services: {
    all: ['services'] as const,
    detail: (id: number) => ['services', id] as const,
  },
  serviceCategories: {
    all: ['service-categories'] as const,
    detail: (id: number) => ['service-categories', id] as const,
  },
  schedules: {
    all: ['schedules'] as const,
    detail: (id: number) => ['schedules', id] as const,
  },
  salary: {
    all: ['salary'] as const,
    detail: (id: number) => ['salary', id] as const,
  },
};
