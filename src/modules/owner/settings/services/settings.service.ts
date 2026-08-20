import {
  mockSettingsItems,
  mockUsers,
  mockDepartments,
  mockAuditLogs,
  mockAutomationRules,
  mockInviteLinks,
  mockJourneyStages,
  mockTaskTemplates,
  mockSlaRules,
  mockAlertRules,
  mockApprovalRules
} from '../mocks/settings.mock';
import {
  SettingItem,
  UserItem,
  DepartmentItem,
  AuditLogItem,
  AutomationRule,
  InviteLink,
  JourneyStage,
  TaskTemplate,
  SlaRule,
  AlertRule,
  ApprovalRule,
  SettingsVersion
} from '../types/settings.types';

class SettingsService {
  private settings: SettingItem[] = [...mockSettingsItems];
  private users: UserItem[] = [...mockUsers];
  private departments: DepartmentItem[] = [...mockDepartments];
  private auditLogs: AuditLogItem[] = [...mockAuditLogs];
  private automations: AutomationRule[] = [...mockAutomationRules];
  constructor() {}

  private getStoredInviteLinks(): InviteLink[] {
    const stored = localStorage.getItem('company_os_invite_links');
    if (!stored) {
      localStorage.setItem('company_os_invite_links', JSON.stringify(mockInviteLinks));
      return [...mockInviteLinks];
    }
    return JSON.parse(stored);
  }

  private saveStoredInviteLinks(links: InviteLink[]) {
    localStorage.setItem('company_os_invite_links', JSON.stringify(links));
  }
  private journeyStages: JourneyStage[] = [...mockJourneyStages];
  private taskTemplates: TaskTemplate[] = [...mockTaskTemplates];
  private slaRules: SlaRule[] = [...mockSlaRules];
  private alertRules: AlertRule[] = [...mockAlertRules];
  private approvalRules: ApprovalRule[] = [...mockApprovalRules];
  private versions: SettingsVersion[] = [
    {
      id: 'v-1',
      timestamp: '2026-08-20 01:00:00',
      actor: 'م. أحمد العتيبي (Owner)',
      changedKeys: ['weight_speed', 'weight_quality'],
      beforeValues: { weight_speed: 40, weight_quality: 25 },
      afterValues: { weight_speed: 35, weight_quality: 30 },
      reason: 'تحديث أوزان أداء المهام لزيادة التركيز على الجودة'
    }
  ];

  getSettings(): SettingItem[] {
    return this.settings;
  }

  getUsers(): UserItem[] {
    return this.users;
  }

  getDepartments(): DepartmentItem[] {
    return this.departments;
  }

  getAuditLogs(): AuditLogItem[] {
    return this.auditLogs;
  }

  getAutomationRules(): AutomationRule[] {
    return this.automations;
  }

  getInviteLinks(): InviteLink[] {
    return this.getStoredInviteLinks();
  }

  getJourneyStages(): JourneyStage[] {
    return this.journeyStages;
  }

  getTaskTemplates(): TaskTemplate[] {
    return this.taskTemplates;
  }

  getSlaRules(): SlaRule[] {
    return this.slaRules;
  }

  getAlertRules(): AlertRule[] {
    return this.alertRules;
  }

  getApprovalRules(): ApprovalRule[] {
    return this.approvalRules;
  }

  getSettingsVersions(): SettingsVersion[] {
    return this.versions;
  }

  // Simulate updating settings and logging audits
  saveSettings(changes: Record<string, any>, reason: string = 'تعديل عبر لوحة التحكم'): Promise<{ success: boolean; logs: AuditLogItem[] }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newLogs: AuditLogItem[] = [];
        const beforeValues: Record<string, any> = {};
        const afterValues: Record<string, any> = {};
        const changedKeys: string[] = [];

        Object.keys(changes).forEach((key) => {
          const setting = this.settings.find((s) => s.id === key);
          if (setting) {
            const beforeVal = typeof setting.value === 'object' ? JSON.stringify(setting.value) : String(setting.value);
            const afterVal = typeof changes[key] === 'object' ? JSON.stringify(changes[key]) : String(changes[key]);

            if (beforeVal !== afterVal) {
              beforeValues[key] = setting.value;
              afterValues[key] = changes[key];
              changedKeys.push(key);

              const log: AuditLogItem = {
                id: `alog-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                actor: 'م. أحمد العتيبي (Owner)',
                action: `تعديل إعداد: ${setting.title} (${reason})`,
                resource: `إعدادات / ${setting.category}`,
                resourceId: key,
                before: beforeVal,
                after: afterVal,
                ip: '192.168.1.100',
                device: 'Chrome / Windows',
                result: 'success',
              };

              setting.value = changes[key];
              newLogs.push(log);
              this.auditLogs.unshift(log);
            }
          }
        });

        if (changedKeys.length > 0) {
          const newVersion: SettingsVersion = {
            id: `v-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            actor: 'م. أحمد العتيبي (Owner)',
            changedKeys,
            beforeValues,
            afterValues,
            reason
          };
          this.versions.unshift(newVersion);
        }

        resolve({ success: true, logs: newLogs });
      }, 400);
    });
  }

  // Restore settings version
  restoreVersion(versionId: string): Promise<boolean> {
    return new Promise((resolve) => {
      const version = this.versions.find((v) => v.id === versionId);
      if (version) {
        Object.keys(version.beforeValues).forEach((key) => {
          const setting = this.settings.find((s) => s.id === key);
          if (setting) {
            setting.value = version.beforeValues[key];
          }
        });

        // Add audit log
        const log: AuditLogItem = {
          id: `alog-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          actor: 'م. أحمد العتيبي (Owner)',
          action: `استرجاع إعدادات سابقة للنسخة: ${versionId}`,
          resource: 'Settings Management',
          resourceId: versionId,
          before: 'N/A',
          after: 'Restored previous state',
          ip: '192.168.1.100',
          device: 'Chrome / Windows',
          result: 'success',
        };
        this.auditLogs.unshift(log);
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  // Update a user's role or status
  updateUser(userId: string, updates: Partial<UserItem>): UserItem | null {
    const userIndex = this.users.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updates };

      const log: AuditLogItem = {
        id: `alog-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: 'م. أحمد العتيبي (Owner)',
        action: `تحديث بيانات المستخدم: ${this.users[userIndex].name}`,
        resource: 'Users',
        resourceId: userId,
        before: 'N/A',
        after: JSON.stringify(updates),
        ip: '192.168.1.100',
        device: 'Chrome / Windows',
        result: 'success',
      };
      this.auditLogs.unshift(log);

      return this.users[userIndex];
    }
    return null;
  }

  // Create Department
  createDepartment(dept: Omit<DepartmentItem, 'id' | 'membersCount'>): DepartmentItem {
    const newDept: DepartmentItem = {
      ...dept,
      id: `dept-${Date.now()}`,
      membersCount: 0,
    };
    this.departments.push(newDept);

    const log: AuditLogItem = {
      id: `alog-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: 'م. أحمد العتيبي (Owner)',
      action: `إنشاء قسم جديد: ${dept.name}`,
      resource: 'Departments',
      resourceId: newDept.id,
      before: 'None',
      after: JSON.stringify(newDept),
      ip: '192.168.1.100',
      device: 'Chrome / Windows',
      result: 'success',
    };
    this.auditLogs.unshift(log);

    return newDept;
  }

  // Create Automation Rule
  createAutomationRule(rule: Omit<AutomationRule, 'id' | 'isActive'>): AutomationRule {
    const newRule: AutomationRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      isActive: true,
    };
    this.automations.push(newRule);
    return newRule;
  }

  // Invite Links methods
  createInviteLink(link: Omit<InviteLink, 'id' | 'code' | 'isUsed' | 'createdAt'>): InviteLink {
    const links = this.getStoredInviteLinks();
    const newLink: InviteLink = {
      ...link,
      id: `inv-${Date.now()}`,
      code: Math.random().toString(36).substring(2, 10).toUpperCase(),
      isUsed: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    links.unshift(newLink);
    this.saveStoredInviteLinks(links);
    return newLink;
  }

  validateInviteCode(code: string): InviteLink | null {
    const links = this.getStoredInviteLinks();
    const link = links.find((l) => l.code === code && !l.isUsed);
    if (!link) return null;
    return link;
  }

  consumeInviteCode(code: string): void {
    const links = this.getStoredInviteLinks();
    const idx = links.findIndex((l) => l.code === code);
    if (idx !== -1) {
      links[idx].isUsed = true;
      this.saveStoredInviteLinks(links);
    }
  }

  // Journey Stages methods
  updateJourneyStage(id: string, updates: Partial<JourneyStage>): JourneyStage | null {
    const idx = this.journeyStages.findIndex((s) => s.id === id);
    if (idx !== -1) {
      this.journeyStages[idx] = { ...this.journeyStages[idx], ...updates };
      return this.journeyStages[idx];
    }
    return null;
  }

  createJourneyStage(stage: Omit<JourneyStage, 'id'>): JourneyStage {
    const newStage: JourneyStage = {
      ...stage,
      id: `stage-${Date.now()}`
    };
    this.journeyStages.push(newStage);
    return newStage;
  }

  deleteJourneyStage(id: string): boolean {
    const beforeLen = this.journeyStages.length;
    this.journeyStages = this.journeyStages.filter((s) => s.id !== id);
    return this.journeyStages.length < beforeLen;
  }

  // Task Template methods
  createTaskTemplate(template: Omit<TaskTemplate, 'id'>): TaskTemplate {
    const newTemp: TaskTemplate = {
      ...template,
      id: `tmpl-${Date.now()}`
    };
    this.taskTemplates.push(newTemp);
    return newTemp;
  }

  deleteTaskTemplate(id: string): boolean {
    const beforeLen = this.taskTemplates.length;
    this.taskTemplates = this.taskTemplates.filter((t) => t.id !== id);
    return this.taskTemplates.length < beforeLen;
  }

  // Sla Rule update
  updateSlaRule(id: string, updates: Partial<SlaRule>): SlaRule | null {
    const idx = this.slaRules.findIndex((r) => r.id === id);
    if (idx !== -1) {
      this.slaRules[idx] = { ...this.slaRules[idx], ...updates };
      return this.slaRules[idx];
    }
    return null;
  }

  // Alert Rule methods
  createAlertRule(rule: Omit<AlertRule, 'id' | 'isActive'>): AlertRule {
    const newRule: AlertRule = {
      ...rule,
      id: `alr-${Date.now()}`,
      isActive: true
    };
    this.alertRules.push(newRule);
    return newRule;
  }

  deleteAlertRule(id: string): boolean {
    const beforeLen = this.alertRules.length;
    this.alertRules = this.alertRules.filter((r) => r.id !== id);
    return this.alertRules.length < beforeLen;
  }

  // Approval Rule updates
  updateApprovalRule(id: string, updates: Partial<ApprovalRule>): ApprovalRule | null {
    const idx = this.approvalRules.findIndex((r) => r.id === id);
    if (idx !== -1) {
      this.approvalRules[idx] = { ...this.approvalRules[idx], ...updates };
      return this.approvalRules[idx];
    }
    return null;
  }
}

export const settingsService = new SettingsService();
