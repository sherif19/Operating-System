import { createBrowserRouter, Navigate } from 'react-router-dom';
import { authRoutes, directAuthRoutes } from './auth.routes';
import { clientRoutes, clientWelcomeRoute } from './client.routes';
import { employeeRoutes } from './employee.routes';
import { managerRoutes } from './manager.routes';
import { ownerRoutes } from './owner.routes';
import { useAuthStore } from '@/stores/auth.store';

function RootRedirect() {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user) {
    return <Navigate to="/owner/mission-control" replace />;
  }
  return <Navigate to="/auth/admin-login" replace />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  authRoutes,
  ...directAuthRoutes,
  clientRoutes,
  clientWelcomeRoute,
  employeeRoutes,
  managerRoutes,
  ownerRoutes,
  {
    path: '*',
    element: (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-extrabold text-indigo-400">404</h1>
        <p className="text-sm text-slate-400 mt-2">الصفحة غير موجودة أو ليس لديك صلاحية الوصول إليها</p>
        <a href="/owner/mission-control" className="mt-4 px-4 py-2 bg-indigo-600 rounded-xl text-xs font-semibold">
          العودة للمركز الرئيسي
        </a>
      </div>
    ),
  },
]);
