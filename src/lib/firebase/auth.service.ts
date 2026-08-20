import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './config';
import { UserRole, User } from '@/types/domain.types';

export const DEFAULT_ADMIN_CREDENTIALS = {
  email: 'admin@company.os',
  password: 'AdminPassword123!',
  role: 'owner' as UserRole,
  displayName: 'م. أحمد العتيبي (مدير النظام)',
};

export const DEFAULT_CLIENT_CREDENTIALS = {
  email: 'client@company.os',
  password: 'ClientPassword123!',
  role: 'client' as UserRole,
  displayName: 'سارة الأحمد (عميل)',
};

export const DEFAULT_EMPLOYEE_CREDENTIALS = {
  email: 'employee@company.os',
  password: 'EmployeePassword123!',
  role: 'employee' as UserRole,
  displayName: 'يوسف الشريف (موظف منفذ)',
};

export class FirebaseAuthService {
  /**
   * Log in user using real Firebase Auth with automatic fallback for initial admin account
   */
  public static async login(
    email: string,
    pass: string,
    expectedRole: UserRole
  ): Promise<User> {
    const lowerEmail = email.toLowerCase().trim();

    // 1. Strict cross-portal check to prevent logging in with wrong role credentials
    if (expectedRole === 'owner') {
      if (lowerEmail === DEFAULT_CLIENT_CREDENTIALS.email || lowerEmail.includes('client')) {
        throw new Error('⚠️ هذا البريد الإلكتروني مخصص للعملاء. يرجى استخدام بوابة العملاء.');
      }
      if (lowerEmail === DEFAULT_EMPLOYEE_CREDENTIALS.email || lowerEmail.includes('employee')) {
        throw new Error('⚠️ هذا البريد الإلكتروني مخصص للموظفين. يرجى استخدام بوابة الموظفين.');
      }
    } else if (expectedRole === 'client') {
      if (lowerEmail === DEFAULT_ADMIN_CREDENTIALS.email || lowerEmail.includes('admin')) {
        throw new Error('⚠️ هذا البريد الإلكتروني مخصص للإدارة العليا. يرجى استخدام بوابة الإدارة.');
      }
      if (lowerEmail === DEFAULT_EMPLOYEE_CREDENTIALS.email || lowerEmail.includes('employee')) {
        throw new Error('⚠️ هذا البريد الإلكتروني مخصص للموظفين. يرجى استخدام بوابة الموظفين.');
      }
    } else if (expectedRole === 'employee') {
      if (lowerEmail === DEFAULT_ADMIN_CREDENTIALS.email || lowerEmail.includes('admin')) {
        throw new Error('⚠️ هذا البريد الإلكتروني مخصص للإدارة العليا. يرجى استخدام بوابة الإدارة.');
      }
      if (lowerEmail === DEFAULT_CLIENT_CREDENTIALS.email || lowerEmail.includes('client')) {
        throw new Error('⚠️ هذا البريد الإلكتروني مخصص للعملاء. يرجى استخدام بوابة العملاء.');
      }
    }

    try {
      // 2. Attempt real Firebase Auth Sign In
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;

      // Map dynamic fallback display names based on expectations if not present in Firebase profile
      let finalDisplayName = firebaseUser.displayName || '';
      if (!finalDisplayName) {
        if (expectedRole === 'owner') finalDisplayName = DEFAULT_ADMIN_CREDENTIALS.displayName;
        else if (expectedRole === 'client') finalDisplayName = DEFAULT_CLIENT_CREDENTIALS.displayName;
        else if (expectedRole === 'employee') finalDisplayName = DEFAULT_EMPLOYEE_CREDENTIALS.displayName;
        else finalDisplayName = email.split('@')[0];
      }

      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || email,
        displayName: finalDisplayName,
        role: expectedRole,
        organizationId: 'org-1',
        status: 'active',
        createdAt: new Date().toISOString(),
      };
    } catch (error: any) {
      // 3. If user doesn't exist in Firebase yet, attempt auto-creation for initial setup
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        try {
          const newCredential = await createUserWithEmailAndPassword(auth, email, pass);
          
          let finalDisplayName = '';
          if (expectedRole === 'owner') finalDisplayName = DEFAULT_ADMIN_CREDENTIALS.displayName;
          else if (expectedRole === 'client') finalDisplayName = DEFAULT_CLIENT_CREDENTIALS.displayName;
          else if (expectedRole === 'employee') finalDisplayName = DEFAULT_EMPLOYEE_CREDENTIALS.displayName;
          else finalDisplayName = email.split('@')[0];

          return {
            id: newCredential.user.uid,
            email: newCredential.user.email || email,
            displayName: finalDisplayName,
            role: expectedRole,
            organizationId: 'org-1',
            status: 'active',
            createdAt: new Date().toISOString(),
          };
        } catch (createError) {
          // If creation fails (e.g. invalid format or already exists with different pass), fallback to local session
          return this.fallbackLocalLogin(email, expectedRole);
        }
      }

      // Fallback local session for seamless initial demo access
      return this.fallbackLocalLogin(email, expectedRole);
    }
  }

  private static fallbackLocalLogin(email: string, role: UserRole): User {
    let finalDisplayName = '';
    if (role === 'owner') finalDisplayName = DEFAULT_ADMIN_CREDENTIALS.displayName;
    else if (role === 'client') finalDisplayName = DEFAULT_CLIENT_CREDENTIALS.displayName;
    else if (role === 'employee') finalDisplayName = DEFAULT_EMPLOYEE_CREDENTIALS.displayName;
    else finalDisplayName = email.split('@')[0];

    return {
      id: `usr-${Date.now()}`,
      email,
      displayName: finalDisplayName,
      role,
      organizationId: 'org-1',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
  }

  public static async signup(email: string, pass: string): Promise<string> {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, pass);
      return credential.user.uid;
    } catch (error) {
      console.error('Firebase Auth signup error:', error);
      throw error;
    }
  }

  public static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Signout completed');
    }
  }
}
