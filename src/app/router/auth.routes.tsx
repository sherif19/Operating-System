import { RouteObject, Navigate } from 'react-router-dom';
import { AuthLayout } from '@/app/layouts/auth-layout';
import { AdminLoginPage } from '@/modules/authentication/pages/admin-login-page';
import { ClientLoginPage } from '@/modules/authentication/pages/client-login-page';
import { EmployeeLoginPage } from '@/modules/authentication/pages/employee-login-page';
import { ClientRegisterPage } from '@/modules/customer-portal/authentication/client-register-page';
import { EmployeeRegisterPage } from '@/modules/authentication/pages/employee-register-page';

export const authRoutes: RouteObject = {
  path: '/auth',
  element: <AuthLayout />,
  children: [
    { path: '', element: <Navigate to="admin-login" replace /> },
    { path: 'login', element: <Navigate to="admin-login" replace /> },
    { path: 'admin-login', element: <AdminLoginPage /> },
    { path: 'client-login', element: <ClientLoginPage /> },
    { path: 'employee-login', element: <EmployeeLoginPage /> },
    { path: 'client-register', element: <ClientRegisterPage /> },
    { path: 'employee-register', element: <EmployeeRegisterPage /> },
  ],
};

// Top-level aliases for direct navigation links without /auth prefix
export const directAuthRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      { path: '/employee-register', element: <EmployeeRegisterPage /> },
      { path: '/client-register', element: <ClientRegisterPage /> },
      { path: '/employee-login', element: <EmployeeLoginPage /> },
      { path: '/client-login', element: <ClientLoginPage /> },
      { path: '/admin-login', element: <AdminLoginPage /> },
    ],
  },
];
