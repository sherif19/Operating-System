import { EmployeesDB } from '../../services/employees-db';
import { EmployeeProfile } from '../../types/domain.types';

export class AssignmentEngine {
  /**
   * Identifies the best employee to receive a task based on department matching,
   * active workloads, and availability statuses.
   */
  static getBestAssignee(departmentId: string, requiredSkill?: string): EmployeeProfile | null {
    const employees = EmployeesDB.getEmployees();

    // 1. Filter by Department and Active status
    let candidates = employees.filter(
      (e) => e.departmentId === departmentId && e.status === 'active'
    );

    if (candidates.length === 0) {
      // Fallback: search for active employees regardless of department
      candidates = employees.filter((e) => e.status === 'active');
    }

    // 2. Filter by Skill matching if specified
    if (requiredSkill) {
      const skilledCandidates = candidates.filter((e) =>
        e.skills.some((skill) => skill.toLowerCase().includes(requiredSkill.toLowerCase()))
      );
      if (skilledCandidates.length > 0) {
        candidates = skilledCandidates;
      }
    }

    if (candidates.length === 0) return null;

    // 3. Find candidate with the lowest workload score
    let selected = candidates[0];
    let minLoad = Infinity;

    candidates.forEach((c) => {
      if (c.workloadScore < minLoad) {
        minLoad = c.workloadScore;
        selected = c;
      }
    });

    return selected;
  }

  /**
   * Increments employee workload score when a task is accepted.
   */
  static incrementWorkload(employeeId: string, taskWeight = 10): void {
    const emps = EmployeesDB.getEmployees();
    const idx = emps.findIndex((e) => e.id === employeeId);
    if (idx === -1) return;

    emps[idx].activeTasksCount++;
    emps[idx].workloadScore = Math.min(100, emps[idx].workloadScore + taskWeight);
    EmployeesDB.saveEmployees(emps);
  }

  /**
   * Decrements employee workload score when a task is completed.
   */
  static decrementWorkload(employeeId: string, taskWeight = 10): void {
    const emps = EmployeesDB.getEmployees();
    const idx = emps.findIndex((e) => e.id === employeeId);
    if (idx === -1) return;

    emps[idx].activeTasksCount = Math.max(0, emps[idx].activeTasksCount - 1);
    emps[idx].workloadScore = Math.max(0, emps[idx].workloadScore - taskWeight);
    EmployeesDB.saveEmployees(emps);
  }
}
