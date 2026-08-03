import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Center, Loader, Stack, Text } from '@mantine/core';
import { AppLayout } from '@/shared/ui/AppLayout';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';
import { PermissionGuard } from '@/app/router/PermissionGuard';
import { SmartRedirect } from '@/app/router/SmartRedirect';
import { PermissionCode } from '@/shared/lib/permissions';
import { AUTH_ENABLED } from '@/shared/config/env';

// Критичные страницы загружаем сразу
import { BoardPage } from '@/pages/board';
import { LoginPage } from '@/pages/login';

// Остальные страницы - lazy load
const AppointmentsPage = lazy(() =>
  import('@/pages/appointments').then((m) => ({ default: m.AppointmentsPage }))
);
const ClientsPage = lazy(() =>
  import('@/pages/clients').then((m) => ({ default: m.ClientsPage }))
);
const ServicesPage = lazy(() =>
  import('@/pages/services').then((m) => ({ default: m.ServicesPage }))
);
const EmployeesPage = lazy(() =>
  import('@/pages/employees').then((m) => ({ default: m.EmployeesPage }))
);
const EmployeeProfilePage = lazy(() =>
  import('@/pages/employees').then((m) => ({ default: m.EmployeeProfilePage }))
);
const MaterialsPage = lazy(() =>
  import('@/pages/materials').then((m) => ({ default: m.MaterialsPage }))
);
const FinancePage = lazy(() =>
  import('@/pages/finance').then((m) => ({ default: m.FinancePage }))
);
const NotificationsPage = lazy(() =>
  import('@/pages/notifications').then((m) => ({ default: m.NotificationsPage }))
);
const SettingsPage = lazy(() =>
  import('@/pages/settings').then((m) => ({ default: m.SettingsPage }))
);
const AdminPage = lazy(() =>
  import('@/pages/admin').then((m) => ({ default: m.AdminPage }))
);

const PageLoader = () => (
  <Center h="100%" style={{ animation: 'fade-in 280ms ease both' }}>
    <Stack align="center" gap="sm">
      <Box style={{ animation: 'soft-pulse 1.2s ease-in-out infinite' }}>
        <Loader size="lg" color="sage" type="dots" />
      </Box>
      <Text size="sm" c="dimmed">
        Загрузка…
      </Text>
    </Stack>
  </Center>
);

export const AppRouter: React.FC = () => (
  <Routes>
    <Route
      path="/login"
      element={AUTH_ENABLED ? <LoginPage /> : <Navigate to="/board" replace />}
    />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route index element={<SmartRedirect />} />
        <Route path="/board" element={
          <PermissionGuard permissions={[PermissionCode.APPOINTMENT_READ, PermissionCode.APPOINTMENT_MANAGE]}>
            <BoardPage />
          </PermissionGuard>
        } />
        <Route
          path="/appointments"
          element={
            <Suspense fallback={<PageLoader />}>
              <PermissionGuard permissions={[PermissionCode.APPOINTMENT_READ, PermissionCode.APPOINTMENT_MANAGE]}>
                <AppointmentsPage />
              </PermissionGuard>
            </Suspense>
          }
        />
        <Route
          path="/clients"
          element={
            <Suspense fallback={<PageLoader />}>
              <PermissionGuard permissions={[PermissionCode.CLIENT_READ, PermissionCode.CLIENT_MANAGE]}>
                <ClientsPage />
              </PermissionGuard>
            </Suspense>
          }
        />
        <Route
          path="/services"
          element={
            <Suspense fallback={<PageLoader />}>
              <PermissionGuard permissions={[PermissionCode.SERVICE_READ, PermissionCode.SERVICE_MANAGE]}>
                <ServicesPage />
              </PermissionGuard>
            </Suspense>
          }
        />
        <Route
          path="/employees"
          element={
            <Suspense fallback={<PageLoader />}>
              <PermissionGuard permissions={[PermissionCode.EMPLOYEE_READ, PermissionCode.EMPLOYEE_MANAGE]}>
                <EmployeesPage />
              </PermissionGuard>
            </Suspense>
          }
        />
        <Route
          path="/employees/:id"
          element={
            <Suspense fallback={<PageLoader />}>
              <PermissionGuard permissions={[PermissionCode.EMPLOYEE_READ, PermissionCode.EMPLOYEE_MANAGE]}>
                <EmployeeProfilePage />
              </PermissionGuard>
            </Suspense>
          }
        />
        <Route
          path="/materials"
          element={
            <Suspense fallback={<PageLoader />}>
              <PermissionGuard permissions={[PermissionCode.MATERIAL_READ, PermissionCode.MATERIAL_MANAGE]}>
                <MaterialsPage />
              </PermissionGuard>
            </Suspense>
          }
        />
        <Route
          path="/finance"
          element={
            <Suspense fallback={<PageLoader />}>
              <PermissionGuard permissions={[PermissionCode.RECEIPT_READ, PermissionCode.RECEIPT_MANAGE, PermissionCode.PAYROLL_READ, PermissionCode.PAYROLL_MANAGE, PermissionCode.TRANSACTION_READ, PermissionCode.TRANSACTION_MANAGE]}>
                <FinancePage />
              </PermissionGuard>
            </Suspense>
          }
        />
        <Route
          path="/notifications"
          element={
            <Suspense fallback={<PageLoader />}>
              <PermissionGuard permissions={[PermissionCode.NOTIFICATION_READ, PermissionCode.NOTIFICATION_MANAGE]}>
                <NotificationsPage />
              </PermissionGuard>
            </Suspense>
          }
        />
        <Route
          path="/settings"
          element={
            <Suspense fallback={<PageLoader />}>
              <PermissionGuard permissions={[PermissionCode.TENANT_PREFERENCES_READ, PermissionCode.TENANT_MANAGE]}>
                <SettingsPage />
              </PermissionGuard>
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<PageLoader />}>
              <PermissionGuard adminOnly>
                <AdminPage />
              </PermissionGuard>
            </Suspense>
          }
        />
        <Route path="*" element={<SmartRedirect />} />
      </Route>
    </Route>
  </Routes>
);
