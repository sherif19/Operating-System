import { CustomersDB } from '../../services/customers-db';
import { Customer, CustomerTask } from '../../types/domain.types';
import { CustomerStage } from '@/types/domain.types';

export interface StageApprovalState {
  stageId: CustomerStage;
  departmentName: string;
  employeeName: string;
  managerName: string;
  status: 'not_started' | 'in_progress' | 'pending_approval' | 'approved' | 'rejected_needs_revision';
  submissionNotes?: string;
  rejectionReason?: string;
  submittedAt?: string;
  reviewedAt?: string;
}

export const DEFAULT_STAGE_ASSIGNMENTS: Record<
  CustomerStage,
  { department: string; employee: string; manager: string }
> = {
  registration: {
    department: 'قسم المبيعات والتحويل',
    employee: 'خالد عبد الرحمن',
    manager: 'م. أحمد العتيبي',
  },
  onboarding: {
    department: 'قسم خدمة العملاء والتشغيل',
    employee: 'سهى محمد',
    manager: 'د. محمد الكردي',
  },
  kickoff_call: {
    department: 'قسم التوجيه والكوتشينج',
    employee: 'يوسف الشريف',
    manager: 'م. أحمد العتيبي',
  },
  post_kickoff: {
    department: 'قسم التوجيه والتنفيذ',
    employee: 'يوسف الشريف',
    manager: 'د. محمد الكردي',
  },
  setup: {
    department: 'قسم التطوير والبرمجة',
    employee: 'منة الله كريم',
    manager: 'د. محمد الكردي',
  },
  execution: {
    department: 'قسم التنفيذ والإنتاج',
    employee: 'منة الله كريم',
    manager: 'د. محمد الكردي',
  },
  review: {
    department: 'قسم ضبط الجودة والاعتماد',
    employee: 'عمر مصطفى',
    manager: 'م. أحمد العتيبي',
  },
  delivery: {
    department: 'قسم التسليم والمخرجات',
    employee: 'سهى محمد',
    manager: 'د. محمد الكردي',
  },
  wrapup_call: {
    department: 'قسم خدمة العملاء',
    employee: 'يوسف الشريف',
    manager: 'م. أحمد العتيبي',
  },
  post_delivery: {
    department: 'قسم المتابعة والدعم المستمر',
    employee: 'سهى محمد',
    manager: 'د. محمد الكردي',
  },
};

export class JourneyEngine {
  static STAGES_ORDER: CustomerStage[] = [
    'registration',
    'onboarding',
    'kickoff_call',
    'post_kickoff',
    'setup',
    'execution',
    'review',
    'delivery',
    'wrapup_call',
    'post_delivery',
  ];

  static getStageApprovals(customerId: string): StageApprovalState[] {
    const key = `cos_stage_approvals_${customerId}`;
    const saved = localStorage.getItem(key);
    const customers = CustomersDB.getCustomers();
    const customer = customers.find((c) => c.id === customerId);

    const currentStageIndex = customer
      ? this.STAGES_ORDER.indexOf(customer.currentStage)
      : 0;

    let approvals: StageApprovalState[] = [];

    if (saved) {
      try {
        approvals = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse stage approvals', e);
      }
    }

    // Build or sync complete approvals list for all 10 stages
    const result: StageApprovalState[] = this.STAGES_ORDER.map((stageId, idx) => {
      const existing = approvals.find((a) => a.stageId === stageId);
      const defaults = DEFAULT_STAGE_ASSIGNMENTS[stageId];

      let status: StageApprovalState['status'] = 'not_started';
      if (existing?.status) {
        status = existing.status;
      } else {
        if (idx < currentStageIndex) status = 'approved';
        else if (idx === currentStageIndex) status = 'in_progress';
        else status = 'not_started';
      }

      return {
        stageId,
        departmentName: existing?.departmentName || defaults.department,
        employeeName: existing?.employeeName || defaults.employee,
        managerName: existing?.managerName || defaults.manager,
        status,
        submissionNotes: existing?.submissionNotes,
        rejectionReason: existing?.rejectionReason,
        submittedAt: existing?.submittedAt,
        reviewedAt: existing?.reviewedAt,
      };
    });

    return result;
  }

  static saveStageApprovals(customerId: string, approvals: StageApprovalState[]): void {
    const key = `cos_stage_approvals_${customerId}`;
    localStorage.setItem(key, JSON.stringify(approvals));
  }

  static submitStageForApproval(
    customerId: string,
    stageId: CustomerStage,
    submissionNotes?: string
  ): StageApprovalState[] {
    const approvals = this.getStageApprovals(customerId);
    const idx = approvals.findIndex((a) => a.stageId === stageId);
    if (idx !== -1) {
      approvals[idx] = {
        ...approvals[idx],
        status: 'pending_approval',
        submissionNotes,
        submittedAt: new Date().toLocaleString('ar-EG'),
      };
      this.saveStageApprovals(customerId, approvals);
    }
    return approvals;
  }

  static approveStage(customerId: string, stageId: CustomerStage): StageApprovalState[] {
    const approvals = this.getStageApprovals(customerId);
    const idx = approvals.findIndex((a) => a.stageId === stageId);
    if (idx !== -1) {
      approvals[idx] = {
        ...approvals[idx],
        status: 'approved',
        reviewedAt: new Date().toLocaleString('ar-EG'),
      };
      this.saveStageApprovals(customerId, approvals);

      // Automatically advance customer to the next stage in STAGES_ORDER
      const currentIdx = this.STAGES_ORDER.indexOf(stageId);
      if (currentIdx !== -1 && currentIdx < this.STAGES_ORDER.length - 1) {
        const nextStage = this.STAGES_ORDER[currentIdx + 1];
        this.advanceStage(customerId, nextStage);
      }
    }
    return approvals;
  }

  static rejectStage(
    customerId: string,
    stageId: CustomerStage,
    rejectionReason: string
  ): StageApprovalState[] {
    const approvals = this.getStageApprovals(customerId);
    const idx = approvals.findIndex((a) => a.stageId === stageId);
    if (idx !== -1) {
      approvals[idx] = {
        ...approvals[idx],
        status: 'rejected_needs_revision',
        rejectionReason,
        reviewedAt: new Date().toLocaleString('ar-EG'),
      };
      this.saveStageApprovals(customerId, approvals);
    }
    return approvals;
  }

  static evaluateProgress(customerId: string): void {
    const customers = CustomersDB.getCustomers();
    const customerIndex = customers.findIndex((c) => c.id === customerId);
    if (customerIndex === -1) return;

    const tasks = CustomersDB.getTasks().filter((t) => t.customerId === customerId);
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;

    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const healthReasons: string[] = [];
    const delayedTasks = tasks.filter(
      (t) => t.status !== 'completed' && new Date(t.dueDate).getTime() < Date.now()
    );
    if (delayedTasks.length > 0) {
      healthReasons.push(`لديك ${delayedTasks.length} مهام متأخرة عن الموعد`);
    }

    let health: Customer['health'] = 'healthy';
    if (healthReasons.length > 0) {
      health = delayedTasks.length >= 3 ? 'blocked' : 'at_risk';
    }

    customers[customerIndex] = {
      ...customers[customerIndex],
      progress,
      health,
      healthReason: healthReasons.length > 0 ? healthReasons : undefined,
    };

    CustomersDB.saveCustomers(customers);
  }

  static advanceStage(customerId: string, nextStage: CustomerStage): void {
    const customers = CustomersDB.getCustomers();
    const customerIndex = customers.findIndex((c) => c.id === customerId);
    if (customerIndex === -1) return;

    customers[customerIndex].currentStage = nextStage;
    CustomersDB.saveCustomers(customers);

    this.triggerStageAutomation(customerId, nextStage);
    this.evaluateProgress(customerId);
  }

  static triggerStageAutomation(customerId: string, stage: CustomerStage): void {
    const tasks = CustomersDB.getTasks();

    const hasStageTasks = tasks.some((t) => t.customerId === customerId && t.stage === stage);
    if (hasStageTasks) return;

    const baseDueDate = new Date();
    baseDueDate.setDate(baseDueDate.getDate() + 5);
    const dueDateStr = baseDueDate.toISOString().split('T')[0];

    const newTasks: CustomerTask[] = [];

    if (stage === 'onboarding') {
      newTasks.push(
        {
          id: `task-auto-${Date.now()}-1`,
          customerId,
          title: 'ملء استبيان معلومات الشركة البداية',
          description: 'تعبئة استمارة معلومات البيزنس.',
          status: 'pending',
          priority: 'high',
          dueDate: dueDateStr,
          createdAt: new Date().toISOString().split('T')[0],
          isRequired: true,
          stage: 'onboarding',
        },
        {
          id: `task-auto-${Date.now()}-2`,
          customerId,
          title: 'رفع شعار الشركة (Logo)',
          description: 'رفع ملفات اللوجو بالصيغة المعتمدة.',
          status: 'pending',
          priority: 'medium',
          dueDate: dueDateStr,
          createdAt: new Date().toISOString().split('T')[0],
          isRequired: true,
          stage: 'onboarding',
        }
      );
    } else if (stage === 'setup') {
      newTasks.push(
        {
          id: `task-auto-${Date.now()}-3`,
          customerId,
          title: 'شراء الدومين (النطاق)',
          description: 'شراء النطاق المطلوب وتأكيد حسابات السيرفر.',
          status: 'pending',
          priority: 'high',
          dueDate: dueDateStr,
          createdAt: new Date().toISOString().split('T')[0],
          isRequired: true,
          stage: 'setup',
        }
      );
    }

    if (newTasks.length > 0) {
      CustomersDB.saveTasks([...tasks, ...newTasks]);
    }
  }
}
