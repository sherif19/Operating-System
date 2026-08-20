export interface Department {
  id: string;
  name: string;
  engName: string;
  status: '🟢 نشط' | '🟡 نشط جزئياً' | '🔴 حرج';
  iconName: string; // lucide icon name e.g. 'TrendingUp', 'Users', 'Zap', etc.
  color: string; // e.g., 'pink', 'emerald', 'indigo', 'rose', 'cyan', 'purple', 'amber'
  kpis: { label: string; value: string }[];
}

const DEFAULT_DEPARTMENTS: Department[] = [
  {
    id: 'marketing',
    name: 'قسم التسويق والمحتوى',
    engName: 'Marketing',
    status: '🟢 نشط',
    iconName: 'TrendingUp',
    color: 'pink',
    kpis: [
      { label: 'أعضاء الفريق', value: '0 موظفين' },
      { label: 'حملات نشطة', value: '0 حملات' },
    ],
  },
  {
    id: 'sales',
    name: 'قسم المبيعات والتحويل',
    engName: 'Sales',
    status: '🟢 نشط',
    iconName: 'Users',
    color: 'emerald',
    kpis: [
      { label: 'أعضاء الفريق', value: '0 موظفين' },
      { label: 'صفقات مقفلة', value: '0 صفقات' },
    ],
  },
  {
    id: 'execution',
    name: 'قسم التنفيذ والإنتاج',
    engName: 'Execution',
    status: '🟢 نشط',
    iconName: 'Zap',
    color: 'indigo',
    kpis: [
      { label: 'أعضاء الفريق', value: '0 موظفين' },
      { label: 'مشاريع قيد التنفيذ', value: '0 مشاريع' },
    ],
  },
  {
    id: 'support',
    name: 'قسم خدمة العملاء والدعم',
    engName: 'Support',
    status: '🟢 نشط',
    iconName: 'AlertTriangle',
    color: 'rose',
    kpis: [
      { label: 'أعضاء الفريق', value: '0 موظفين' },
      { label: 'تذاكر مفتوحة', value: '0 تذاكر' },
    ],
  },
  {
    id: 'development',
    name: 'قسم التطوير والبرمجة',
    engName: 'Development',
    status: '🟢 نشط',
    iconName: 'Settings',
    color: 'cyan',
    kpis: [
      { label: 'أعضاء الفريق', value: '0 موظفين' },
      { label: 'Sprints نشطة', value: '0' },
    ],
  },
  {
    id: 'design',
    name: 'قسم التصميم والهوية',
    engName: 'Design',
    status: '🟢 نشط',
    iconName: 'Sparkles',
    color: 'purple',
    kpis: [
      { label: 'أعضاء الفريق', value: '0 موظفين' },
      { label: 'طلبات التصميم', value: '0 طلب' },
    ],
  },
  {
    id: 'finance',
    name: 'قسم المالية والحسابات',
    engName: 'Finance',
    status: '🟢 نشط',
    iconName: 'BarChart3',
    color: 'emerald',
    kpis: [
      { label: 'أعضاء الفريق', value: '0 موظفين' },
      { label: 'الفواتير المستحقة', value: '0 فواتير' },
    ],
  },
  {
    id: 'hr',
    name: 'قسم الموارد البشرية',
    engName: 'HR',
    status: '🟢 نشط',
    iconName: 'Users',
    color: 'amber',
    kpis: [
      { label: 'الموظفون النشطون', value: '0 / 0' },
      { label: 'طلبات التوظيف', value: '0 طلب' },
    ],
  },
];

const LOCAL_STORAGE_KEY = 'company_os_departments';

export class DepartmentsService {
  public static getDepartments(): Department[] {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      this.saveDepartments(DEFAULT_DEPARTMENTS);
      return DEFAULT_DEPARTMENTS;
    }
    return JSON.parse(data);
  }

  public static saveDepartments(depts: Department[]) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(depts));
    window.dispatchEvent(new Event('departments_updated'));
  }

  public static addDepartment(dept: Omit<Department, 'id'>): Department {
    const depts = this.getDepartments();
    const newDept: Department = {
      ...dept,
      id: dept.engName.toLowerCase().replace(/\s+/g, '-'),
    };
    depts.push(newDept);
    this.saveDepartments(depts);
    return newDept;
  }

  public static updateDepartment(id: string, updates: Partial<Department>): Department | null {
    const depts = this.getDepartments();
    const idx = depts.findIndex((d) => d.id === id);
    if (idx !== -1) {
      depts[idx] = { ...depts[idx], ...updates };
      this.saveDepartments(depts);
      return depts[idx];
    }
    return null;
  }

  public static deleteDepartment(id: string): boolean {
    const depts = this.getDepartments();
    const filtered = depts.filter((d) => d.id !== id);
    if (filtered.length < depts.length) {
      this.saveDepartments(filtered);
      return true;
    }
    return false;
  }
}
