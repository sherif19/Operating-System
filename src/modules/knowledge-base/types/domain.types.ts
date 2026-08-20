export type KnowledgeType = 'ARTICLE' | 'SOP' | 'POLICY' | 'GUIDE' | 'FAQ' | 'DECISION';
export type KnowledgeStatus = 'draft' | 'pending_review' | 'published' | 'archived' | 'expired';

export interface KnowledgeDocument {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  type: KnowledgeType;
  authorId: string;
  departmentId: string;
  category: string;
  tags: string[];
  status: KnowledgeStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
  reviewDate?: string; // e.g. "2026-11-20"
  visibility: 'private' | 'employee' | 'department' | 'managers' | 'owner' | 'customer';
  feedbackScore: { helpful: number; unhelpful: number };
}

export interface KnowledgeVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  body: string;
  authorId: string;
  createdAt: string;
  changeLog: string;
}

export interface KnowledgeGapLog {
  query: string;
  searchCount: number;
  lastSearchedAt: string;
  isResolved: boolean;
}
