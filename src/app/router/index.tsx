import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/shared/ui/layout';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';
import { BoardPage } from '@/pages/board';
import { ServicesPage } from '@/pages/services';
import { EmployeesPage, EmployeeProfilePage } from '@/pages/employees';
import { ClientsPage } from '@/pages/clients';
import { LoginPage } from '@/pages/login';

export const AppRouter: React.FC = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/board" replace />} />
        <Route path="/board" element={<BoardPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/employees/:id" element={<EmployeeProfilePage />} />
        <Route path="*" element={<Navigate to="/board" replace />} />
      </Route>
    </Route>
  </Routes>
);
