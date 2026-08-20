import { useAuthStore } from '@/stores/auth.store';
import { Permission, hasPermission } from './permissions';
import { UserRole } from '@/types/domain.types';

export function usePermission() {
  const user = useAuthStore((state) => state.user);

  const role = user?.role ?? 'client';

  const can = (permission: Permission): boolean => {
    if (!user) return false;
    return hasPermission(role, permission);
  };

  const hasRole = (...roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(role);
  };

  return { can, hasRole, role, user };
}
