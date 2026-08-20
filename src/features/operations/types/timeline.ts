export type EventCategory = 
  | 'FINANCE' 
  | 'CUSTOMER_JOURNEY' 
  | 'APPOINTMENT' 
  | 'TASK_DELIVERABLE' 
  | 'AUTOMATION_AI' 
  | 'SECURITY_SYSTEM';

export type ActorType = 'USER' | 'CUSTOMER' | 'SYSTEM_AUTOMATION' | 'AI_AGENT';

export interface TimelineEvent {
  id: string;
  organizationId: string;
  category: EventCategory;
  eventType: string; // e.g., 'PAYMENT_RECEIVED', 'TASK_ACCEPTED', 'STAGE_TRANSITION'
  title: string;
  description: string;
  actor: {
    id: string;
    name: string;
    type: ActorType;
    avatarUrl?: string;
    role?: string;
  };
  relatedEntity: {
    entityId: string;
    entityType: 'CUSTOMER' | 'TASK' | 'APPOINTMENT' | 'DELIVERABLE' | 'INVOICE' | 'USER';
    entityName: string;
    navigationUrl: string;
  };
  departmentId?: string;
  metadata?: {
    beforeState?: Record<string, any>;
    afterState?: Record<string, any>;
    executionTimeMs?: number;
    automationRuleId?: string;
    [key: string]: any;
  };
  timestamp: string; // ISO 8601
  severity?: 'INFO' | 'WARNING' | 'CRITICAL';
}
