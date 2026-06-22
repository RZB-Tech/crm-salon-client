import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authStorage } from '@/shared/api/client';

export const ProtectedRoute: React.FC = () => {
  if (!authStorage.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
