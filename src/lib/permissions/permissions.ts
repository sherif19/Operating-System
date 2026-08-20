import { UserRole } from '@/types/domain.types';

export type Permission =
  | 'customers:read'
  | 'customers:write'
  | 'customers:delete'
  | 'tasks:read'
  | 'tasks:write'
  | 'tasks:assign'
  | 'analytics:internal'
  | 'analytics:employee'
  | 'analytics:executive'
  | 'finance:read'
  | 'finance:write'
  | 'settings:org'
  | 'settings:roles'
  | 'audit:read'
  | 'ai:mentor'
  | 'ai:generate_reports'
  | 'collaboration:channel_create';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  owner: [
    'customers:read', 'customers:write', 'customers:delete',
    'tasks:read', 'tasks:write', 'tasks:assign',
    'analytics:internal', 'analytics:employee', 'analytics:executive',
    'finance:read', 'finance:write',
    'settings:org', 'settings:roles',
    'audit:read',
    'ai:mentor', 'ai:generate_reports',
    'collaboration:channel_create'
  ],
  admin: [
    'customers:read', 'customers:write',
    'tasks:read', 'tasks:write', 'tasks:assign',
    'analytics:internal', 'analytics:employee',
    'finance:read',
    'settings:org',
    'audit:read',
    'ai:mentor', 'ai:generate_reports',
    'collaboration:channel_create'
  ],
  manager: [
    'customers:read', 'customers:write',
    'tasks:read', 'tasks:write', 'tasks:assign',
    'analytics:internal', // For department employees only
    'ai:mentor', 'ai:generate_reports',
    'collaboration:channel_create'
  ],
  employee: [
    'tasks:read', 'tasks:write',
    'ai:mentor',
    // Note: Employees DO NOT have analytics:internal or analytics:employee for themselves
  ],
  trainer: [
    'customers:read',
    'tasks:read', 'tasks:write',
    'ai:mentor'
  ],
  customer_service: [
    'customers:read', 'customers:write',
    'tasks:read', 'tasks:write',
    'ai:mentor'
  ],
  client: [
    // Clients only access their own data via client portal
    'ai:mentor'
  ]
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
