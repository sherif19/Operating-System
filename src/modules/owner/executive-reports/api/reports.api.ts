import { ReportsDB } from '../services/reports-db';
import { MetricsAggregator } from '../services/metrics-aggregator';
import { KPIOverview, InteractiveReport } from '../types/domain.types';

export class ExecutiveReportsApi {
  static async fetchOverview(): Promise<KPIOverview> {
    return MetricsAggregator.compileLiveMetrics();
  }

  static async fetchReports(): Promise<InteractiveReport[]> {
    return new Promise((resolve) => {
      resolve(ReportsDB.getReports());
    });
  }

  /**
   * Compiles interactive AI analytics reports based on selected timeframe.
   */
  static async generateAIReport(period: 'daily' | 'weekly' | 'monthly' | 'quarterly'): Promise<InteractiveReport> {
    return new Promise(async (resolve) => {
      const stats = await MetricsAggregator.compileLiveMetrics();
      const list = ReportsDB.getReports();

      const newReport: InteractiveReport = {
        id: `rep-${period}-${Date.now()}`,
        title: `تقرير AI التنفيذي — فترة ${period === 'daily' ? 'اليوم' : period === 'weekly' ? 'الأسبوع' : period === 'monthly' ? 'الشهر' : 'الربع'} المحدث`,
        createdAt: new Date().toISOString().split('T')[0],
        period,
        summary: `تم توليد هذا التقرير تلقائياً بواسطة AI للتحليل المالي والتشغيلي. معدل إنجاز المهام يبلغ ${stats.slaComplianceRate}% ومتوسط سرعة تسليم المهام ${stats.avgExecutionMinutes} دقيقة.`,
        planVsActual: [
          { indicator: 'المهام المنجزة والتشغيل', planned: 50, actual: stats.completedTasks, variance: `${Math.round(((stats.completedTasks - 50) / 50) * 100)}%`, trend: 'up' },
          { indicator: 'الإيرادات المحققة', planned: 450000, actual: stats.revenue, variance: '+7.1%', trend: 'up' },
          { indicator: 'العملاء النشطون', planned: 30, actual: stats.activeCustomers, variance: `${Math.round(((stats.activeCustomers - 30) / 30) * 100)}%`, trend: 'up' },
        ],
        risks: [
          { severity: stats.atRiskCustomers > 0 ? 'critical' : 'warning', source: 'إدارة العملاء', description: `يوجد عدد ${stats.atRiskCustomers} عملاء متعثرين في المسار بحاجة لمتابعة فورية.` },
        ],
        recommendations: [
          'تكثيف متابعة التسليمات مع قسم التنفيذ لتقليص متوسط زمن إنجاز المهام.',
          'جدولة جلسات AI لمراجعة العوامل المؤثرة على رضا العملاء المتعثرين.',
        ],
      };

      list.push(newReport);
      ReportsDB.saveReports(list);
      resolve(newReport);
    });
  }
}
export default ExecutiveReportsApi;
