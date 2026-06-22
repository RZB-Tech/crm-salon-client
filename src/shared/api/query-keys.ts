export const queryKeys = {
  clients: {
    all: ['clients'] as const,
    detail: (id: number) => ['clients', id] as const,
  },
  employees: {
    all: ['employees'] as const,
    detail: (id: number) => ['employees', id] as const,
    workSchedules: (id: number) => ['employees', id, 'work-schedules'] as const,
    payrolls: (id: number) => ['employees', id, 'payrolls'] as const,
    appointments: (id: number) => ['employees', id, 'appointments'] as const,
  },
  services: {
    all: ['services'] as const,
    detail: (id: number) => ['services', id] as const,
  },
  serviceCategories: {
    all: ['service-categories'] as const,
    detail: (id: number) => ['service-categories', id] as const,
  },
  workSchedules: {
    all: ['work-schedules'] as const,
    detail: (id: number) => ['work-schedules', id] as const,
  },
  absences: {
    all: ['absences'] as const,
    detail: (id: number) => ['absences', id] as const,
  },
  payrolls: {
    all: ['payrolls'] as const,
    detail: (id: number) => ['payrolls', id] as const,
  },
  appointments: {
    all: ['appointments'] as const,
    detail: (id: number) => ['appointments', id] as const,
  },
};
