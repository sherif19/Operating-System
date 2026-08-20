import { CustomerStage, TaskStatus, AppointmentType } from '@/types/domain.types';

export interface Customer {
  id: string;
  organizationId: string;
  userId: string;
  name: string;
  email: string;
  whatsapp: string;
  companyName: string;
  logoUrl?: string;
  assignedTrainerId?: string;
  customerServiceOwnerId?: string;
  currentStage: CustomerStage;
  progress: number; // 0-100
  health: 'healthy' | 'attention' | 'at_risk' | 'blocked' | 'completed';
  healthReason?: string[]; // e.g. ["3 tasks delayed", "Missed last meeting"]
  joinedAt: string;
  expectedDeliveryDate?: string;
}

export interface CustomerInvite {
  id: string;
  organizationId: string;
  inviteCode: string;
  customerEmail?: string;
  expiresAt: string;
  usedAt?: string;
  status: 'valid' | 'used' | 'revoked' | 'expired';
}

export interface TaskComment {
  id: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface CustomerTask {
  id: string;
  customerId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  isRequired: boolean;
  stage: CustomerStage;
  attachments?: string[];
  proofMedia?: string[];
  comments?: TaskComment[];
}

export interface CustomerAppointment {
  id: string;
  customerId: string;
  staffId: string;
  type: AppointmentType;
  startsAt: string;
  endsAt: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  meetingLink?: string;
  notes?: string;
}

export interface CustomerDeliverable {
  id: string;
  customerId: string;
  stage: CustomerStage;
  title: string;
  type: 'file' | 'link' | 'access_credential' | 'certificate' | 'deliverable_package';
  status: 'draft' | 'under_review' | 'approved' | 'delivered';
  storageRefOrUrl: string;
  version: number;
  createdAt: string;
  description?: string;
  credentialsUsername?: string;
  credentialsCiphertext?: string; // masked credentials
}

export interface TicketReply {
  id: string;
  authorName: string;
  authorRole: 'client' | 'staff' | 'system';
  text: string;
  attachments?: string[];
  createdAt: string;
}

export interface CustomerSupportTicket {
  id: string;
  customerId: string;
  customerName?: string;
  subject: string;
  description: string;
  category: 'technical' | 'financial' | 'consultation' | 'bug' | 'general';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'waiting_for_customer' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt?: string;
  assignedStaffName?: string;
  attachments?: string[];
  replies: TicketReply[];
}

export interface CustomerChallenge {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  reward: string;
  progress: number;
  status: 'active' | 'completed' | 'failed';
}
