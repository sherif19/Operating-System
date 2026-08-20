export type UserRole = 
  | 'owner'
  | 'admin'
  | 'manager'
  | 'employee'
  | 'trainer'
  | 'customer_service'
  | 'client';

export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export interface Organization {
  id: string;
  name: string;
  logoUrl?: string;
  timezone: string;
  createdAt: string;
  settings: Record<string, unknown>;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  phoneNumber?: string;
  role: UserRole;
  organizationId: string;
  departmentId?: string;
  status: UserStatus;
  createdAt: string;
  lastLoginAt?: string;
}

export type CustomerStage =
  | 'registration'
  | 'onboarding'
  | 'kickoff_call'
  | 'post_kickoff'
  | 'setup'
  | 'execution'
  | 'review'
  | 'delivery'
  | 'wrapup_call'
  | 'post_delivery';

export interface Customer {
  id: string;
  organizationId: string;
  userId: string; // Linked User account
  inviteId?: string;
  name: string;
  email: string;
  whatsapp: string;
  assignedTrainerId?: string;
  customerServiceOwnerId?: string;
  currentStage: CustomerStage;
  health: 'healthy' | 'at_risk' | 'critical';
  joinedAt: string;
  expectedDeliveryDate?: string;
  metadata?: Record<string, unknown>;
}

export interface CustomerInvite {
  id: string;
  organizationId: string;
  salesRecordId: string;
  codeHash: string;
  customerEmail?: string;
  expiresAt: string;
  usedAt?: string;
  status: 'valid' | 'used' | 'revoked' | 'expired';
}

export type TaskStatus = 'pending' | 'in_progress' | 'under_review' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  organizationId: string;
  templateId?: string;
  title: string;
  description?: string;
  assigneeId: string;
  customerId?: string;
  departmentId?: string;
  status: TaskStatus;
  expectedDurationMinutes: number;
  acceptedAt?: string;
  completedAt?: string;
  effectiveDurationMinutes?: number;
  dueDate: string;
  createdAt: string;
  attachments?: string[];
}

export interface TrainerAssignment {
  id: string;
  customerId: string;
  trainerId: string;
  sequence: number;
  reason: string;
  assignedAt: string;
}

export interface Availability {
  userId: string;
  recurringSlots: { dayOfWeek: number; startTime: string; endTime: string }[];
  exceptions: { date: string; isAvailable: boolean; slots?: { startTime: string; endTime: string }[] }[];
  timezone: string;
}

export type AppointmentType = 'kickoff_call' | 'wrapup_call' | 'consultation' | 'internal';

export interface Appointment {
  id: string;
  organizationId: string;
  customerId: string;
  staffId: string; // Trainer or CS
  type: AppointmentType;
  startsAt: string;
  endsAt: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  meetingLink?: string;
  notes?: string;
}

export interface Deliverable {
  id: string;
  organizationId: string;
  customerId: string;
  stage: CustomerStage;
  title: string;
  type: 'file' | 'link' | 'access_credential' | 'certificate' | 'deliverable_package';
  status: 'draft' | 'under_review' | 'approved' | 'delivered';
  storageRefOrUrl: string;
  version: number;
  publishedAt?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  organizationId: string;
  name: string;
  code: 'marketing' | 'sales' | 'execution' | 'support' | 'development' | 'design' | 'finance' | 'hr';
  managerId?: string;
  pinnedAnnouncements?: { id: string; title: string; content: string; createdAt: string }[];
}

export interface AuditLog {
  id: string;
  organizationId: string;
  actorId: string;
  actorName: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details?: Record<string, unknown>;
  timestamp: string;
}
