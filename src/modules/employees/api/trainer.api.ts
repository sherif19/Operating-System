import { EmployeesDB } from '../services/employees-db';
import { TrainerAvailability } from '../types/domain.types';

export class TrainerApi {
  static async fetchAvailability(trainerId: string): Promise<TrainerAvailability | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = EmployeesDB.getAvailability().find((a) => a.employeeId === trainerId);
        resolve(found || null);
      }, 200);
    });
  }

  static async updateAvailability(availability: TrainerAvailability): Promise<TrainerAvailability> {
    return new Promise((resolve) => {
      const list = EmployeesDB.getAvailability();
      const idx = list.findIndex((a) => a.employeeId === availability.employeeId);
      if (idx === -1) {
        list.push(availability);
      } else {
        list[idx] = availability;
      }
      EmployeesDB.saveAvailability(list);
      resolve(availability);
    });
  }
}
