import React from 'react';
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
  PromotionsPage,
  GiftCardsPage,
  BranchesPage,
  ServicesPage,
  SettingsPage,
  AnalyticsPage,
} from './lazyPages';
import { guardedPage } from './guardedPage';

export const AppRouter: React.FC = () => (
  <Routes>
    <Route path="/login" element={AUTH_ENABLED ? <LoginPage /> : <Navigate to="/board" replace />} />
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
          element={guardedPage(<AppointmentsPage />, [
            PermissionCode.APPOINTMENT_READ,
            PermissionCode.APPOINTMENT_MANAGE,
          ])}
        />
        <Route
          path="/clients"
          element={guardedPage(<ClientsPage />, [PermissionCode.CLIENT_READ, PermissionCode.CLIENT_MANAGE])}
        />
        <Route
          path="/services"
          element={guardedPage(<ServicesPage />, [PermissionCode.SERVICE_READ, PermissionCode.SERVICE_MANAGE])}
        />
        <Route
          path="/promotions"
          element={guardedPage(<PromotionsPage />, [
            PermissionCode.PROMOTION_GET,
            PermissionCode.PROMOTION_MANAGE,
          ])}
        />
        <Route
          path="/gift-cards"
          element={guardedPage(<GiftCardsPage />, [
            PermissionCode.GIFT_CARD_GET,
            PermissionCode.GIFT_CARD_MANAGE,
          ])}
        />
        <Route
          path="/employees"
          element={guardedPage(<EmployeesPage />, [
            PermissionCode.EMPLOYEE_READ,
            PermissionCode.EMPLOYEE_MANAGE,
          ])}
        />
        <Route
          path="/employees/:id"
          element={guardedPage(<EmployeeProfilePage />, [
            PermissionCode.EMPLOYEE_READ,
            PermissionCode.EMPLOYEE_MANAGE,
          ])}
        />
        <Route
          path="/materials"
          element={guardedPage(<MaterialsPage />, [
            PermissionCode.MATERIAL_READ,
            PermissionCode.MATERIAL_MANAGE,
          ])}
        />
        <Route
          path="/finance"
          element={guardedPage(<FinancePage />, [
            PermissionCode.RECEIPT_READ,
            PermissionCode.RECEIPT_MANAGE,
            PermissionCode.PAYROLL_READ,
            PermissionCode.PAYROLL_MANAGE,
            PermissionCode.TRANSACTION_READ,
            PermissionCode.TRANSACTION_MANAGE,
          ])}
        />
        <Route
          path="/analytics"
          element={guardedPage(<AnalyticsPage />, [
            PermissionCode.ANALYTICS_RECEIPT,
            PermissionCode.ANALYTICS_APPOINTMENT,
            PermissionCode.ANALYTICS_TRANSACTION,
            PermissionCode.ANALYTICS_EMPLOYEE,
            PermissionCode.ANALYTICS_SERVICE,
            PermissionCode.ANALYTICS_MANAGE,
          ])}
        />
        <Route
          path="/notifications"
          element={guardedPage(<NotificationsPage />, [
            PermissionCode.NOTIFICATION_READ,
            PermissionCode.NOTIFICATION_MANAGE,
          ])}
        />
        <Route
          path="/settings"
          element={guardedPage(<SettingsPage />, [
            PermissionCode.TENANT_PREFERENCES_READ,
            PermissionCode.TENANT_MANAGE,
          ])}
        />
        <Route
          path="/branches"
          element={guardedPage(<BranchesPage />, [
            PermissionCode.TENANT_BRANCH_READ,
            PermissionCode.TENANT_BRANCH_MANAGE,
            PermissionCode.TENANT_MANAGE,
          ])}
        />
        <Route path="/admin" element={guardedPage(<AdminPage />, undefined, true)} />
        <Route path="*" element={<SmartRedirect />} />
      </Route>
    </Route>
  </Routes>
);
