import { CustomersDB } from '../../services/customers-db';

export class RoundRobinEngine {
  // Available list of trainers/coaches in the organization
  static TRAINERS = ['Omar', 'Ahmed', 'Mennah'];

  /**
   * Identifies the trainer with the least number of assigned appointments/customers
   * to balance the operational workload.
   */
  static getNextTrainer(): string {
    const customers = CustomersDB.getCustomers();
    const trainerLoads: Record<string, number> = {};

    // Initialize loads
    this.TRAINERS.forEach((t) => {
      trainerLoads[t] = 0;
    });

    // Calculate current customer loads
    customers.forEach((c) => {
      if (c.assignedTrainerId && c.assignedTrainerId in trainerLoads) {
        trainerLoads[c.assignedTrainerId]++;
      }
    });

    // Find the minimum load trainer
    let selected = this.TRAINERS[0];
    let minLoad = Infinity;

    this.TRAINERS.forEach((t) => {
      if (trainerLoads[t] < minLoad) {
        minLoad = trainerLoads[t];
        selected = t;
      }
    });

    return selected;
  }

  /**
   * Asserts whether a slot is already booked for a specific trainer, preventing double booking.
   */
  static isSlotAvailable(trainerId: string, startsAt: string): boolean {
    const appointments = CustomersDB.getAppointments();
    const hasConflict = appointments.some(
      (app) =>
        app.staffId === trainerId &&
        app.startsAt === startsAt &&
        app.status !== 'cancelled'
    );
    return !hasConflict;
  }
}
