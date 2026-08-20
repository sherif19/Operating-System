import { create } from 'zustand';
import { User, Organization, UserRole } from '@/types/domain.types';
import { FirebaseFirestoreService } from '@/lib/firebase/firestore.service';

// Demo initial user & organizations for instant state preview
const DEMO_ORGANIZATION: Organization = {
  id: 'org-1',
  name: 'أكاديمية المستبصرين',
  timezone: 'Asia/Riyadh',
  createdAt: new Date().toISOString(),
  settings: {},
};

const DEMO_USER: User = {
  id: 'usr-owner-1',
  email: 'owner@company.os',
  displayName: 'م. أحمد العتيبي',
  role: 'owner',
  organizationId: 'org-1',
  departmentId: 'dept-exec',
  status: 'active',
  createdAt: new Date().toISOString(),
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
};

const STORAGE_KEY = 'company_os_user_profile';
const AUTH_KEY = 'company_os_is_authenticated';

const getInitialAuthStatus = (): boolean => {
  try {
    const isAuth = localStorage.getItem(AUTH_KEY);
    if (isAuth === 'false') return false;
    if (isAuth === 'true') return true;
  } catch (e) {
    console.error('Failed to read auth status from localStorage', e);
  }
  return true;
};

const getInitialUser = (): User | null => {
  try {
    const isAuth = localStorage.getItem(AUTH_KEY);
    if (isAuth === 'false') return null;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEMO_USER, ...parsed };
    }
  } catch (e) {
    console.error('Failed to parse stored user profile', e);
  }
  return DEMO_USER;
};

interface AuthState {
  user: User | null;
  currentOrganization: Organization | null;
  availableOrganizations: Organization[];
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setUser: (user: User | null) => void;
  setOrganization: (org: Organization | null) => void;
  switchRole: (newRole: UserRole) => void;
  updateUserProfile: (displayName: string, phoneNumber: string, avatarUrl: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: getInitialUser(),
  currentOrganization: DEMO_ORGANIZATION,
  availableOrganizations: [DEMO_ORGANIZATION],
  isAuthenticated: getInitialAuthStatus(),
  isLoading: false,

  setUser: (user) => {
    try {
      if (user) {
        localStorage.setItem(AUTH_KEY, 'true');
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.setItem(AUTH_KEY, 'false');
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to set user in localStorage', e);
    }
    set({ user, isAuthenticated: !!user });
  },

  setOrganization: (org) => set({ currentOrganization: org }),
  
  updateUserProfile: (displayName, phoneNumber, avatarUrl) => set((state) => {
    if (!state.user) return state;
    const updatedUser: User = {
      ...state.user,
      displayName,
      phoneNumber,
      avatarUrl
    };

    try {
      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      FirebaseFirestoreService.saveUserProfile(updatedUser);
    } catch (e) {
      console.error('Failed to persist user profile changes', e);
    }

    return {
      user: updatedUser,
      isAuthenticated: true
    };
  }),
  
  // Convenient demo helper for testing different roles
  switchRole: (newRole) => set((state) => {
    if (!state.user) return state;
    const updatedUser: User = {
      ...state.user,
      role: newRole,
      displayName:
        newRole === 'client'
          ? 'سارة الأحمد (عميل)'
          : newRole === 'manager'
          ? 'د. محمد الكردي (مدير)'
          : newRole === 'employee'
          ? 'يوسف الشريف (منفذ)'
          : newRole === 'trainer'
          ? 'محمد (مدرب)'
          : state.user.displayName,
    };

    try {
      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    } catch (e) {
      console.error('Failed to persist role switch', e);
    }

    return {
      user: updatedUser,
      isAuthenticated: true
    };
  }),

  logout: () => {
    try {
      localStorage.setItem(AUTH_KEY, 'false');
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear stored user profile', e);
    }
    set({ user: null, currentOrganization: null, isAuthenticated: false });
  },
}));
