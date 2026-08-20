export type SettingType = 'text' | 'boolean' | 'select' | 'number' | 'color' | 'textarea';

export interface SettingItem {
  id: string;
  category: string;
  group: string;
  title: string;
  description: string;
  type: SettingType;
  value: any;
  defaultValue: any;
  options?: { label: string; value: any }[];
  keywords?: string[];
  dependsOn?: { settingId: string; value: any };
  isSensitive?: boolean;
}

export interface SettingsCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

export interface PermissionItem {
  module: string;
  view: boolean | string;
  create: boolean | string;
  edit: boolean | string;
  delete: boolean | string;
  [key: string]: any; // scope overrides
}

export interface DepartmentItem {
  id: string;
  name: string;
  description: string;
  manager: string;
  membersCount: number;
  status: 'active' | 'archived';
  color: string;
  icon: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  resourceId: string;
  before: string;
  after: string;
  ip: string;
  device: string;
  result: 'success' | 'failed';
}

export interface AutomationRule {
  id: string;
  title: string;
  trigger: string;
  conditions: string;
  actions: string;
  isActive: boolean;
}

export interface InviteLink {
  id: string;
  code: string;
  emailMatch?: string;
  phoneMatch?: string;
  role: string;
  isOneTime: boolean;
  expiresAt: string;
  salesRecord?: string;
  orgMatch?: string;
  isUsed: boolean;
  createdAt: string;
  department?: string;
}

export interface JourneyStage {
  id: string;
  name: string;
  description: string;
  order: number;
  color: string;
  icon: string;
  visibility: 'everyone' | 'internal_only';
  prerequisites: string[];
  tasks: string[];
  articles: string[];
  videos: string[];
  appointments: string[];
  deliverables: string[];
  automations: string[];
  conditions: string[];
  // Stage Rules
  tasksOpenedOnEntry: boolean;
  contentOpenedOnEntry: boolean;
  appointmentRequired: boolean;
  deliverableRequired: boolean;
  approvalRequired: boolean;
  qaRequired: boolean;
  requiredCompletionPct: number;
  autoAdvance: boolean;
  manualAdvance: boolean;
  blockTransition: boolean;
  stageTimeoutHours: number;
}

export interface TaskTemplate {
  id: string;
  title: string;
  description: string;
  role: string;
  department: string;
  customerStage: string;
  trigger: string;
  expectedDurationHours: number;
  maxDurationHours: number;
  priority: 'low' | 'medium' | 'high';
  dependencies: string[];
  requiredFiles: string[];
  requiredApproval: boolean;
  requiredQa: boolean;
  slaEnabled: boolean;
  automationEnabled: boolean;
  notificationEnabled: boolean;
}

export interface SlaRule {
  id: string;
  category: string; // e.g. General Inquiry, Technical Issue...
  responseTimeHours: number;
  resolutionTimeHours: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  escalationRole: string;
  notificationEnabled: boolean;
  owner: string;
  workingHoursOnly: boolean;
}

export interface AlertRule {
  id: string;
  trigger: string; // e.g. Task Overdue, SLA Exceeded...
  severity: 'critical' | 'warning' | 'info';
  actions: string[]; // e.g. Notification, Email, WhatsApp, AI Analysis...
  isActive: boolean;
}

export interface ApprovalRule {
  id: string;
  type: string; // e.g. Invoice, Quotation, Leave...
  approverRole: string;
  level: number;
  isSequential: boolean;
  autoEscalationHours: number;
  reasonRequired: boolean;
  commentsRequired: boolean;
  slaHours: number;
}

export interface SettingsVersion {
  id: string;
  timestamp: string;
  actor: string;
  changedKeys: string[];
  beforeValues: Record<string, any>;
  afterValues: Record<string, any>;
  reason: string;
}
