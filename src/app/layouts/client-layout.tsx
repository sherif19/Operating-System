import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/sidebar/sidebar';
import { Header } from '@/components/layout/header/header';
import { CommandPalette } from '@/components/navigation/command-palette';
import { motion } from 'motion/react';
import { useAuthStore } from '@/stores/auth.store';

export function ClientLayout() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/client-login" replace />;
  }

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        <Header />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
