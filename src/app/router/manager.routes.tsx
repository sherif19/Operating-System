import { RouteObject } from 'react-router-dom';
import { ManagerLayout } from '@/app/layouts/manager-layout';
import { DepartmentOSHub } from '@/features/departments/DepartmentOSHub';
import { ManagerDashboardPage } from '@/modules/management/dashboards/pages/manager-dashboard-page';

export const managerRoutes: RouteObject = {
  path: '/manager',
  element: <ManagerLayout />,
  children: [
    { path: 'department/*', element: <DepartmentOSHub /> },
    { path: 'department', element: <DepartmentOSHub /> },
    { path: 'customers', element: <ManagerDashboardPage /> },
    { path: 'team', element: <DepartmentOSHub /> },
    { path: 'tasks', element: <DepartmentOSHub /> },
    { path: 'calendar', element: <DepartmentOSHub /> },
    { path: 'collaboration', element: <DepartmentOSHub /> },
    { path: 'reports', element: <DepartmentOSHub /> },
    { path: 'analytics', element: <DepartmentOSHub /> },
    { path: 'ai-coach', element: <DepartmentOSHub /> },
  ],
};
