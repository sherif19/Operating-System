export type DepartmentType =
  | 'MARKETING'
  | 'SALES'
  | 'EXECUTION'
  | 'SUPPORT'
  | 'DEVELOPMENT'
  | 'DESIGN'
  | 'FINANCE'
  | 'HR';

export interface DepartmentSummary {
  id: string;
  name: string;
  type: DepartmentType;
  managerId: string;
  managerName: string;
  activeEmployeesCount: number;
  executionSpeedPercentage: number; // e.g. 95%
  openTasksCount: number;
  completedTasksThisWeek: number;
  activeClientsCount: number;
  overallHealthScore: number; // 0-100
}

export interface DepartmentEmployeePerformance {
  userId: string;
  userName: string;
  avatarUrl?: string;
  role: string;
  acceptedTasksCount: number;
  completedTasksCount: number;
  avgExecutionTimeMinutes: number;
  targetExecutionTimeMinutes: number;
  complianceScore: number; // 0 - 100
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  activeWorkload: number;
  skills: string[];
}

export interface TaskExecutionMetric {
  taskId: string;
  taskTitle: string;
  assigneeName: string;
  acceptedAt: string;
  completedAt: string;
  effectiveDurationMinutes: number; // task_completed_at - task_accepted_at
  expectedDurationMinutes: number;
  maxExpectedDurationMinutes: number;
  status: 'EXCELLENT' | 'ON_TIME' | 'DELAYED' | 'CRITICAL_DELAY';
}

export interface DepartmentSOP {
  id: string;
  title: string;
  category: string;
  videoUrl?: string;
  documentUrl?: string;
  steps: string[];
  pinnedBy: string;
  createdAt: string;
  viewsCount: number;
}

export interface DepartmentAnnouncement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  createdAt: string;
}

export interface DepartmentShift {
  userId: string;
  userName: string;
  shiftStart: string;
  shiftEnd: string;
  availabilityStatus: 'AVAILABLE' | 'IN_CALL' | 'ON_LEAVE' | 'OFF';
  assignedClientCallSlots: string[];
}

export interface DepartmentOperationDeliverable {
  id: string;
  clientName: string;
  title: string;
  stageName: string;
  assignedStaff: string;
  dueDate: string;
  status: 'IN_PROGRESS' | 'UNDER_REVIEW' | 'DELIVERED' | 'REJECTED';
  qualityScore?: number;
}
