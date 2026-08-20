import { RouteObject } from 'react-router-dom';
import { ClientLayout } from '@/app/layouts/client-layout';
import { CustomerDashboardPage } from '@/modules/customer-portal/dashboard/customer-dashboard-page';
import { CustomerJourneyPage } from '@/modules/customer-portal/journey/customer-journey-page';
import { ClientTasksPage } from '@/modules/customer-portal/tasks/client-tasks-page';
import { ClientDeliverablesPage } from '@/modules/customer-portal/deliverables/client-deliverables-page';
import { ClientSupportPage } from '@/modules/customer-portal/support/client-support-page';
import { WelcomeExperiencePage } from '@/modules/customer-portal/welcome/welcome-experience-page';
import { ClientArticlesPage } from '@/modules/client-portal/articles/pages/client-articles-page';
import { ClientChallengesPage } from '@/modules/client-portal/challenges/pages/client-challenges-page';
import { AIMentorChat } from '@/modules/ai-brain/chat/components/ai-mentor-chat';

export const clientRoutes: RouteObject = {
  path: '/client',
  element: <ClientLayout />,
  children: [
    { path: 'dashboard', element: <CustomerDashboardPage /> },
    { path: 'journey', element: <CustomerJourneyPage /> },
    { path: 'appointments', element: <CustomerJourneyPage /> },
    { path: 'tasks', element: <ClientTasksPage /> },
    { path: 'deliverables', element: <ClientDeliverablesPage /> },
    { path: 'messages', element: <ClientSupportPage /> },
    { path: 'articles', element: <ClientArticlesPage /> },
    { path: 'challenges', element: <ClientChallengesPage /> },
    { path: 'ai-mentor', element: <AIMentorChat /> },
  ],
};

export const clientWelcomeRoute: RouteObject = {
  path: '/client/welcome',
  element: <WelcomeExperiencePage />,
};
