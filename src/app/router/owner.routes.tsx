import { RouteObject } from 'react-router-dom';
import { OwnerLayout } from '@/app/layouts/owner-layout';
import { MissionControlPage } from '@/modules/owner/executive-dashboard/pages/mission-control-page';
import { AutomationsCenterPage } from '@/modules/owner/automations/pages/automations-center-page';
import { ApprovalsCenterPage } from '@/modules/owner/approvals/pages/approvals-center-page';
import { AlertsCenterPage } from '@/modules/owner/alerts/pages/alerts-center-page';
import { CompanyTimelinePage } from '@/features/operations/components/CompanyTimeline/CompanyTimelinePage';
import { AIMentorChat } from '@/modules/ai-brain/chat/components/ai-mentor-chat';
import { DepartmentOSPage } from '@/modules/departments/pages/department-os-page';
import { CollaborationHubPage } from '@/modules/owner/collaboration/pages/collaboration-hub-page';
import { CustomersPage } from '@/modules/customers/pages/customers-page';
import { CustomerDetailsPage } from '@/modules/customers/pages/customer-details-page';
import { DirectoryPage } from '@/modules/employees/directory/pages/directory-page';
import { EmployeeProfilePage } from '@/modules/employees/profiles/pages/employee-profile';
import { KBDashboardPage } from '@/modules/knowledge-base/dashboard/pages/kb-dashboard-page';
import { ArticleViewerPage } from '@/modules/knowledge-base/articles/pages/article-viewer-page';
import { ExecutiveReportsPage } from '@/modules/owner/executive-reports/pages/executive-reports-page';
import { SettingsPage } from '@/modules/owner/settings/pages/settings-page';

export const ownerRoutes: RouteObject = {
  path: '/owner',
  element: <OwnerLayout />,
  children: [
    { path: 'mission-control', element: <MissionControlPage /> },
    { path: 'ai-brain', element: <AIMentorChat /> },
    { path: 'approvals', element: <ApprovalsCenterPage /> },
    { path: 'alerts', element: <AlertsCenterPage /> },
    { path: 'timeline', element: <CompanyTimelinePage /> },
    { path: 'customers', element: <CustomersPage /> },
    { path: 'customers/:id', element: <CustomerDetailsPage /> },
    { path: 'departments', element: <DepartmentOSPage /> },
    { path: 'employees', element: <DirectoryPage /> },
    { path: 'employees/:id', element: <EmployeeProfilePage /> },
    { path: 'knowledge', element: <KBDashboardPage /> },
    { path: 'knowledge/articles/:id', element: <ArticleViewerPage /> },
    { path: 'collaboration', element: <CollaborationHubPage /> },
    { path: 'automations', element: <AutomationsCenterPage /> },
    { path: 'finance', element: <MissionControlPage /> },
    { path: 'reports', element: <ExecutiveReportsPage /> },
    { path: 'settings', element: <SettingsPage /> },
  ],
};
