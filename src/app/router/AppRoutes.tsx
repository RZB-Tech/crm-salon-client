import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/shared/ui/AppLayout';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';
import { PermissionGuard } from '@/app/router/PermissionGuard';
import { SmartRedirect } from '@/app/router/SmartRedirect';
import { PermissionCode } from '@/shared/lib/permissions';
import { AUTH_ENABLED } from '@/shared/config/env';
import { BoardPage } from '@/pages/board';
import { LoginPage } from '@/pages/login';
import {
  AdminPage,
  AppointmentsPage,
  ClientsPage,
  EmployeeProfilePage,
  EmployeesPage,
  FinancePage,
  MaterialsPage,
  NotificationsPage,
  ServicesPage,
  SettingsPage,
} from './lazyPages';
import { PageLoader } from './PageLoader';

export const AppRouter: React.FC = () => (
  <Routes>
    <Route
      path="/login"
      element={AUTH_ENABLED ? <LoginPage /> : <Navigate to="/board" replace />}
    />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route index element={<SmartRedirect />} />
        <Route
          path="/board"
          element={
            <PermissionGuard permissions={[PermissionCode.APPOINTMENT_READ, PermissionCode.APPOINTMENT_MANAGE]}>
              <BoardPage />
            </PermissionGuard>
          }
        />
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
              <PermissionGuard
                permissions={[
                  PermissionCode.RECEIPT_READ,
                  PermissionCode.RECEIPT_MANAGE,
                  PermissionCode.PAYROLL_READ,
                  PermissionCode.PAYROLL_MANAGE,
                  PermissionCode.TRANSACTION_READ,
                  PermissionCode.TRANSACTION_MANAGE,
                ]}
              >
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
