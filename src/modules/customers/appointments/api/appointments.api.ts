import { CustomersDB } from '../../services/customers-db';
import { CustomerAppointment } from '../../types/domain.types';

export class CustomerAppointmentsApi {
  static async fetchByCustomer(customerId: string): Promise<CustomerAppointment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const apps = CustomersDB.getAppointments().filter((a) => a.customerId === customerId);
        resolve(apps);
      }, 200);
    });
  }

  static async fetchAvailability(): Promise<{ date: string; slots: string[] }[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return next 5 days slots
        const days = [];
        const slotsList = ['10:00 - 10:45', '11:00 - 11:45', '13:00 - 13:45', '14:00 - 14:45', '16:00 - 16:45'];
        for (let i = 1; i <= 5; i++) {
          const date = new Date();
          date.setDate(date.getDate() + i);
          days.push({
            date: date.toISOString().split('T')[0],
            slots: slotsList,
          });
        }
        resolve(days);
      }, 300);
    });
  }

  static async bookAppointment(appointment: Omit<CustomerAppointment, 'id' | 'status'>): Promise<CustomerAppointment> {
    return new Promise((resolve) => {
      const apps = CustomersDB.getAppointments();
      const newApp: CustomerAppointment = {
        ...appointment,
        id: `app-${Date.now()}`,
        status: 'scheduled',
        meetingLink: 'https://zoom.us/j/' + Math.floor(100000000 + Math.random() * 900000000),
      };
      apps.push(newApp);
      CustomersDB.saveAppointments(apps);
      resolve(newApp);
    });
  }
}
