import { EmployeesDB } from '../services/employees-db';
import { EmployeePerformance } from '../types/domain.types';

export class EmployeePerformanceApi {
  static async fetchByEmployee(employeeId: string): Promise<EmployeePerformance | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = EmployeesDB.getPerformance().find((p) => p.employeeId === employeeId);
        resolve(found || null);
      }, 200);
    });
  }

  static async logPerformanceTask(performanceRecord: {
    employeeId: string;
    taskId: string;
    title: string;
    actualDurationMinutes: number;
    expectedDurationMinutes: number;
    varianceMinutes: number;
  }): Promise<EmployeePerformance> {
    return new Promise((resolve) => {
      const perfList = EmployeesDB.getPerformance();
      let idx = perfList.findIndex((p) => p.employeeId === performanceRecord.employeeId);

      const newItem = {
        taskId: performanceRecord.taskId,
        title: performanceRecord.title,
        actualDurationMinutes: performanceRecord.actualDurationMinutes,
        expectedDurationMinutes: performanceRecord.expectedDurationMinutes,
        varianceMinutes: performanceRecord.varianceMinutes,
        completedAt: new Date().toISOString().split('T')[0],
      };

      if (idx === -1) {
        const newRecord: EmployeePerformance = {
          employeeId: performanceRecord.employeeId,
          totalCompletedTasks: 1,
          averageVarianceMinutes: performanceRecord.varianceMinutes,
          completionRate: 100,
          history: [newItem],
        };
        perfList.push(newRecord);
        EmployeesDB.savePerformance(perfList);
        resolve(newRecord);
      } else {
        const rec = perfList[idx];
        const updatedHistory = [...rec.history, newItem];
        const totalCompleted = updatedHistory.length;
        const totalVariance = updatedHistory.reduce((sum, item) => sum + item.varianceMinutes, 0);
        const averageVariance = Math.round(totalVariance / totalCompleted);

        const updated: EmployeePerformance = {
          ...rec,
          totalCompletedTasks: totalCompleted,
          averageVarianceMinutes: averageVariance,
          history: updatedHistory,
        };
        perfList[idx] = updated;
        EmployeesDB.savePerformance(perfList);
        resolve(updated);
      }
    });
  }
}
