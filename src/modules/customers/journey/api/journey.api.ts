import { CustomersDB } from '../../services/customers-db';
import { CustomerDeliverable } from '../../types/domain.types';

export class CustomerJourneyApi {
  static async fetchDeliverables(customerId: string): Promise<CustomerDeliverable[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const dels = CustomersDB.getDeliverables().filter((d) => d.customerId === customerId);
        resolve(dels);
      }, 200);
    });
  }

  static async fetchAllDeliverables(): Promise<CustomerDeliverable[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(CustomersDB.getDeliverables());
      }, 200);
    });
  }

  static async addDeliverable(deliverable: Omit<CustomerDeliverable, 'id' | 'createdAt'>): Promise<CustomerDeliverable> {
    return new Promise((resolve) => {
      const dels = CustomersDB.getDeliverables();
      const newD: CustomerDeliverable = {
        ...deliverable,
        id: `del-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      dels.push(newD);
      CustomersDB.saveDeliverables(dels);
      resolve(newD);
    });
  }
}
