import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router';
import { QueryProvider } from '@/app/providers/query-provider';
import { CustomDialog } from '@/components/ui/custom-dialog';
import { PwaInstallModal } from '@/components/ui/pwa-install-modal';
import { UserProfileModal } from '@/components/navigation/user-profile-modal';

export function App() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
      <CustomDialog />
      <PwaInstallModal />
      <UserProfileModal />
    </QueryProvider>
  );
}

export default App;
