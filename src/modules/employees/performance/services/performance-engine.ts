import { EmployeesDB } from '../../services/employees-db';

export class PerformanceEngine {
  /**
   * Compiles actual variance minutes between expected baseline task durations
   * and completed tasks.
   */
  static calculateVariance(actualMin: number, expectedMin: number): number {
    return actualMin - expectedMin;
  }

  /**
   * Generates department efficiency benchmarks.
   */
  static getDepartmentBenchmark(): { averageVarianceMinutes: number; topEmployeeId: string | null } {
    const list = EmployeesDB.getPerformance();
    if (list.length === 0) {
      return { averageVarianceMinutes: 0, topEmployeeId: null };
    }

    let totalVariance = 0;
    let bestEmployee: string | null = null;
    let minVariance = Infinity;

    list.forEach((perf) => {
      totalVariance += perf.averageVarianceMinutes;
      if (perf.averageVarianceMinutes < minVariance) {
        minVariance = perf.averageVarianceMinutes;
        bestEmployee = perf.employeeId;
      }
    });

    return {
      averageVarianceMinutes: Math.round(totalVariance / list.length),
      topEmployeeId: bestEmployee,
    };
  }
}
