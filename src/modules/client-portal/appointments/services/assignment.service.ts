import { TrainerAssignment, Appointment } from '@/types/domain.types';

// Initial default trainers defined in system specifications
export const INITIAL_TRAINERS = [
  { id: 'trainer-mohamed', name: 'محمد', role: 'trainer', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80' },
  { id: 'trainer-soha', name: 'سهى', role: 'trainer', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80' },
];

export class AssignmentEngine {
  private static assignmentsHistory: TrainerAssignment[] = [];
  private static existingAppointments: Appointment[] = [];

  /**
   * Round Robin assignment logic:
   * Alternates between available trainers based on assignment sequence count.
   */
  public static getNextTrainer(customerId: string): { trainerId: string; sequence: number; reason: string } {
    const sequence = this.assignmentsHistory.length + 1;
    const trainerIndex = (sequence - 1) % INITIAL_TRAINERS.length;
    const selectedTrainer = INITIAL_TRAINERS[trainerIndex];

    const assignment: TrainerAssignment = {
      id: `assign-${Date.now()}`,
      customerId,
      trainerId: selectedTrainer.id,
      sequence,
      reason: `Round-robin sequence #${sequence}`,
      assignedAt: new Date().toISOString(),
    };

    this.assignmentsHistory.push(assignment);

    return {
      trainerId: selectedTrainer.id,
      sequence,
      reason: assignment.reason,
    };
  }

  /**
   * Server-side double booking prevention check
   */
  public static isSlotAvailable(trainerId: string, startsAt: string, endsAt: string): boolean {
    const start = new Date(startsAt).getTime();
    const end = new Date(endsAt).getTime();

    const conflict = this.existingAppointments.some((app) => {
      if (app.staffId !== trainerId || app.status === 'cancelled') return false;
      const appStart = new Date(app.startsAt).getTime();
      const appEnd = new Date(app.endsAt).getTime();

      // Check time overlap
      return start < appEnd && end > appStart;
    });

    return !conflict;
  }

  /**
   * Record appointment with strict conflict prevention
   */
  public static bookAppointment(appointmentData: Omit<Appointment, 'id' | 'status'>): Appointment {
    if (!this.isSlotAvailable(appointmentData.staffId, appointmentData.startsAt, appointmentData.endsAt)) {
      throw new Error('فترة الحجز المختارة غير متاحة نظراً لوجود تعارض في المواعيد.');
    }

    const newAppointment: Appointment = {
      ...appointmentData,
      id: `app-${Date.now()}`,
      status: 'scheduled',
    };

    this.existingAppointments.push(newAppointment);
    return newAppointment;
  }

  public static getTrainerAppointments(trainerId: string): Appointment[] {
    return this.existingAppointments.filter((app) => app.staffId === trainerId);
  }
}
