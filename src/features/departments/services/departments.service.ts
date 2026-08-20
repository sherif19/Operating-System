import {
  DepartmentSummary,
  DepartmentEmployeePerformance,
  TaskExecutionMetric,
  DepartmentSOP,
  DepartmentAnnouncement,
  DepartmentShift,
  DepartmentOperationDeliverable,
} from '../types';

export class DepartmentOSService {
  private static summary: DepartmentSummary = {
    id: 'dept-exec-1',
    name: 'قسم التنفيذ والإنتاج الرقمي',
    type: 'EXECUTION',
    managerId: 'emp-1',
    managerName: 'يوسف الشريف',
    activeEmployeesCount: 0,
    executionSpeedPercentage: 0,
    openTasksCount: 0,
    completedTasksThisWeek: 0,
    activeClientsCount: 0,
    overallHealthScore: 100,
  };

  private static teamPerformance: DepartmentEmployeePerformance[] = [];

  private static taskMetrics: TaskExecutionMetric[] = [];

  private static sops: DepartmentSOP[] = [];

  private static announcements: DepartmentAnnouncement[] = [];

  private static shifts: DepartmentShift[] = [];

  private static deliverables: DepartmentOperationDeliverable[] = [];

  // Service Methods
  static getSummary(): DepartmentSummary {
    return {
      ...this.summary,
      activeEmployeesCount: this.teamPerformance.length,
      openTasksCount: this.taskMetrics.filter((t) => t.status !== 'EXCELLENT' && t.status !== 'ON_TIME').length,
    };
  }

  static getTeamPerformance(): DepartmentEmployeePerformance[] {
    return this.teamPerformance;
  }

  static getTaskMetrics(): TaskExecutionMetric[] {
    return this.taskMetrics;
  }

  static getSOPs(): DepartmentSOP[] {
    return this.sops;
  }

  static getAnnouncements(): DepartmentAnnouncement[] {
    return this.announcements;
  }

  static getShifts(): DepartmentShift[] {
    return this.shifts;
  }

  static getDeliverables(): DepartmentOperationDeliverable[] {
    return this.deliverables;
  }

  // Calculate execution speed: effective_duration = task_completed_at - task_accepted_at
  static calculateEffectiveDurationMinutes(acceptedAt: string, completedAt: string): number {
    const start = new Date(acceptedAt).getTime();
    const end = new Date(completedAt).getTime();
    if (isNaN(start) || isNaN(end)) return 0;
    return Math.max(0, Math.round((end - start) / (1000 * 60)));
  }

  // Add new SOP
  static addSOP(sop: Omit<DepartmentSOP, 'id' | 'createdAt' | 'viewsCount'>): DepartmentSOP {
    const newSop: DepartmentSOP = {
      ...sop,
      id: `sop-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      viewsCount: 1,
    };
    this.sops.unshift(newSop);
    return newSop;
  }

  // Add new Announcement
  static addAnnouncement(ann: Omit<DepartmentAnnouncement, 'id' | 'createdAt'>): DepartmentAnnouncement {
    const newAnn: DepartmentAnnouncement = {
      ...ann,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.announcements.unshift(newAnn);
    return newAnn;
  }
}
