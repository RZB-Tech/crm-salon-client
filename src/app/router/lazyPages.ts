import { lazy } from 'react';

export const AppointmentsPage = lazy(() =>
  import('@/pages/appointments').then((m) => ({ default: m.AppointmentsPage })),
);
export const ClientsPage = lazy(() =>
  import('@/pages/clients').then((m) => ({ default: m.ClientsPage })),
);
export const ServicesPage = lazy(() =>
  import('@/pages/services').then((m) => ({ default: m.ServicesPage })),
);
export const EmployeesPage = lazy(() =>
  import('@/pages/employees').then((m) => ({ default: m.EmployeesPage })),
);
export const EmployeeProfilePage = lazy(() =>
  import('@/pages/employees').then((m) => ({ default: m.EmployeeProfilePage })),
);
export const MaterialsPage = lazy(() =>
  import('@/pages/materials').then((m) => ({ default: m.MaterialsPage })),
);
export const FinancePage = lazy(() =>
  import('@/pages/finance').then((m) => ({ default: m.FinancePage })),
);
export const NotificationsPage = lazy(() =>
  import('@/pages/notifications').then((m) => ({ default: m.NotificationsPage })),
);
export const SettingsPage = lazy(() =>
  import('@/pages/settings').then((m) => ({ default: m.SettingsPage })),
);
export const AdminPage = lazy(() =>
  import('@/pages/admin').then((m) => ({ default: m.AdminPage })),
);
