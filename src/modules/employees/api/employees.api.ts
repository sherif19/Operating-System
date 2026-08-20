import { EmployeesDB } from '../services/employees-db';
import { EmployeeProfile } from '../types/domain.types';

export class EmployeesApi {
  static async fetchAll(): Promise<EmployeeProfile[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(EmployeesDB.getEmployees());
      }, 200);
    });
  }

  static async fetchById(id: string): Promise<EmployeeProfile | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = EmployeesDB.getEmployees().find((e) => e.id === id);
        resolve(found || null);
      }, 200);
    });
  }

  static async updateStatus(id: string, status: EmployeeProfile['status']): Promise<EmployeeProfile> {
    return new Promise((resolve, reject) => {
      const emps = EmployeesDB.getEmployees();
      const idx = emps.findIndex((e) => e.id === id);
      if (idx === -1) return reject(new Error('Employee not found'));

      const updated = { ...emps[idx], status };
      emps[idx] = updated;
      EmployeesDB.saveEmployees(emps);
      resolve(updated);
    });
  }

  static async deleteEmployee(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const emps = EmployeesDB.getEmployees().filter((e) => e.id !== id);
        EmployeesDB.saveEmployees(emps);
        resolve(true);
      }, 200);
    });
  }
}
