import { UserRole } from '@/types/domain.types';

export type EmployeeStatus = 'active' | 'away' | 'on_leave' | 'inactive' | 'suspended';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId: string;
  status: EmployeeStatus;
  avatarUrl?: string;
  joinedAt: string;
  workloadScore: number; // 0 to 100
  assignedCustomersCount: number;
  activeTasksCount: number;
}

export interface EmployeeProfile extends Employee {
  phoneNumber: string;
  bio?: string;
  personalGoals: string[];
  skills: string[];
}

export interface TrainerAvailability {
  employeeId: string;
  weeklyDays: number[]; // e.g. [1, 2, 3, 4, 5]
  workingHours: { start: string; end: string };
  exceptions: { date: string; isAvailable: boolean }[];
  maxCallsPerDay: number;
  maxCallsPerWeek: number;
}

export interface TrainerCustomerRelation {
  trainerId: string;
  customerId: string;
  assignedAt: string;
  notes: {
    id: string;
    authorId: string;
    content: string;
    createdAt: string;
    isPrivate: boolean;
  }[];
}

export interface EmployeePerformance {
  employeeId: string;
  totalCompletedTasks: number;
  averageVarianceMinutes: number; // actual vs expected
  completionRate: number; // percentage
  history: {
    taskId: string;
    title: string;
    actualDurationMinutes: number;
    expectedDurationMinutes: number;
    varianceMinutes: number;
    completedAt: string;
  }[];
}

export interface EmployeeGoal {
  id: string;
  employeeId: string;
  title: string;
  target: number;
  actual: number;
  unit: string;
  period: 'daily' | 'weekly' | 'monthly';
  status: 'pending' | 'achieved' | 'missed';
}

export interface EmployeeTrainingCourse {
  id: string;
  title: string;
  description: string;
  durationHours: number;
  progress: number; // 0 to 100
  status: 'enrolled' | 'completed';
  certificateUrl?: string;
}
