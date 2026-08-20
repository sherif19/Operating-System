import { RouteObject } from 'react-router-dom';
import { EmployeeLayout } from '@/app/layouts/employee-layout';
import { DashboardPage } from '@/modules/employee-portal/dashboard/pages/dashboard-page';
import { TodayPage } from '@/modules/employee-portal/today/pages/today-page';
import { TasksPage } from '@/modules/employee-portal/my-tasks/pages/tasks-page';
import { CustomerListPage } from '@/modules/employee-portal/my-customers/pages/customer-list-page';
import { MentorPage } from '@/modules/employee-portal/ai-mentor/pages/mentor-page';

import { KBDashboardPage } from '@/modules/knowledge-base/dashboard/pages/kb-dashboard-page';
import { ArticleViewerPage } from '@/modules/knowledge-base/articles/pages/article-viewer-page';
import { CollaborationHubPage } from '@/modules/owner/collaboration/pages/collaboration-hub-page';

export const employeeRoutes: RouteObject = {
  path: '/employee',
  element: <EmployeeLayout />,
  children: [
    { path: 'dashboard', element: <DashboardPage /> },
    { path: 'today', element: <TodayPage /> },
    { path: 'tasks', element: <TasksPage /> },
    { path: 'calendar', element: <TodayPage /> },
    { path: 'customers', element: <CustomerListPage /> },
    { path: 'collaboration', element: <CollaborationHubPage /> },
    { path: 'knowledge', element: <KBDashboardPage /> },
    { path: 'knowledge/articles/:id', element: <ArticleViewerPage /> },
    { path: 'ai-mentor', element: <MentorPage /> },
  ],
};
