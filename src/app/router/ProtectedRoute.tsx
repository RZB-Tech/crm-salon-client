import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authStorage } from '@/shared/api/client';
import { useRefreshToken } from '@/shared/api/hooks/useAuth';

export const ProtectedRoute: React.FC = () => {
  const refreshToken = useRefreshToken();

  React.useEffect(() => {
    if (authStorage.isAuthenticated()) {
      refreshToken.mutate();
    }
  }, []);

  if (!authStorage.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
