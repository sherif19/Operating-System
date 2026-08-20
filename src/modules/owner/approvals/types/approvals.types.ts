export interface ApprovalAttachment {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  size?: string;
}

export type ApprovalCategory = 'leave' | 'invoice' | 'proposal' | 'content' | 'refund' | 'general';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ApprovalItem {
  id: string;
  title: string;
  detail: string;
  description: string;
  category: ApprovalCategory;
  requesterName: string;
  requesterRole: string;
  department: string;
  status: ApprovalStatus;
  createdAt: string;
  amount?: string;
  leaveStartDate?: string;
  leaveEndDate?: string;
  leaveDaysCount?: number;
  attachments: ApprovalAttachment[];
  reviewNote?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}
