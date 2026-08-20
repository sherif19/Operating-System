import { CustomerStage } from '@/types/domain.types';

export type HealthStatus = 'healthy' | 'attention' | 'at_risk';

export interface KPIOverview {
  companyHealth: number; // 0-100
  revenue: number;
  expenses: number;
  netIncome: number;
  openTasks: number;
  completedTasks: number;
  delayedTasks: number;
  avgExecutionMinutes: number;
  slaComplianceRate: number; // e.g. 92%
  activeCustomers: number;
  atRiskCustomers: number;
  aiSessionsCount: number;
  aiAcceptanceRate: number; // e.g. 84%
}

export interface InteractiveReport {
  id: string;
  title: string;
  createdAt: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  summary: string;
  planVsActual: {
    indicator: string;
    planned: number;
    actual: number;
    variance: string;
    trend: 'up' | 'down' | 'stable';
  }[];
  risks: {
    severity: 'critical' | 'warning';
    source: string;
    description: string;
  }[];
  recommendations: string[];
}

export interface DepartmentHealth {
  id: string;
  name: string;
  healthScore: number;
  openTasks: number;
  delayedTasks: number;
  avgDurationMinutes: number;
  workloadRate: number; // percentage
  status: HealthStatus;
}

export interface CustomerHealthOverview {
  id: string;
  name: string;
  stage: CustomerStage;
  progress: number;
  healthStatus: HealthStatus;
  reason: string;
}
