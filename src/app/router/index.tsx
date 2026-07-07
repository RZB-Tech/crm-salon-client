import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Center, Loader } from '@mantine/core';
import { AppLayout } from '@/shared/ui/layout';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';
import { AUTH_ENABLED } from '@/shared/config/env';

// Критичные страницы загружаем сразу
import { BoardPage } from '@/pages/board';
import { LoginPage } from '@/pages/login';

// Остальные страницы - lazy load
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

// Компонент загрузки для Suspense
const PageLoader = () => (
  <Center h="100%">
    <Loader size="lg" />
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
        <Route index element={<Navigate to="/board" replace />} />
        <Route path="/board" element={<BoardPage />} />
        <Route
          path="/clients"
          element={
            <Suspense fallback={<PageLoader />}>
              <ClientsPage />
            </Suspense>
          }
        />
        <Route
          path="/services"
          element={
            <Suspense fallback={<PageLoader />}>
              <ServicesPage />
            </Suspense>
          }
        />
        <Route
          path="/employees"
          element={
            <Suspense fallback={<PageLoader />}>
              <EmployeesPage />
            </Suspense>
          }
        />
        <Route
          path="/employees/:id"
          element={
            <Suspense fallback={<PageLoader />}>
              <EmployeeProfilePage />
            </Suspense>
          }
        />
        <Route
          path="/materials"
          element={
            <Suspense fallback={<PageLoader />}>
              <MaterialsPage />
            </Suspense>
          }
        />
        <Route
          path="/finance"
          element={
            <Suspense fallback={<PageLoader />}>
              <FinancePage />
            </Suspense>
          }
        />
        <Route
          path="/notifications"
          element={
            <Suspense fallback={<PageLoader />}>
              <NotificationsPage />
            </Suspense>
          }
        />
        <Route
          path="/settings"
          element={
            <Suspense fallback={<PageLoader />}>
              <SettingsPage />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/board" replace />} />
      </Route>
    </Route>
  </Routes>
);
