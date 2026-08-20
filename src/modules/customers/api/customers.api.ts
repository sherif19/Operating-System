import { CustomersDB } from '../services/customers-db';
import { Customer, CustomerInvite } from '../types/domain.types';

export class CustomersApi {
  static async fetchAll(): Promise<Customer[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(CustomersDB.getCustomers());
      }, 300);
    });
  }

  static async fetchById(id: string): Promise<Customer | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = CustomersDB.getCustomers().find((c) => c.id === id);
        resolve(found || null);
      }, 200);
    });
  }

  static async createInvite(orgId: string, email?: string): Promise<CustomerInvite> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const invites = CustomersDB.getInvites();
        const code = `INV-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
        const newInvite: CustomerInvite = {
          id: `inv-${Date.now()}`,
          organizationId: orgId,
          inviteCode: code,
          customerEmail: email,
          expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(), // 7 days expiration
          status: 'valid',
        };
        invites.push(newInvite);
        CustomersDB.saveInvites(invites);
        resolve(newInvite);
      }, 300);
    });
  }

  static async validateInvite(code: string): Promise<CustomerInvite | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const invite = CustomersDB.getInvites().find((i) => i.inviteCode === code && i.status === 'valid');
        if (!invite) return resolve(null);
        // check expiration
        if (new Date(invite.expiresAt).getTime() < Date.now()) {
          invite.status = 'expired';
          const invites = CustomersDB.getInvites().map((i) => i.id === invite.id ? invite : i);
          CustomersDB.saveInvites(invites);
          return resolve(null);
        }
        resolve(invite);
      }, 400);
    });
  }

  static async consumeInvite(code: string): Promise<void> {
    return new Promise((resolve) => {
      const invites = CustomersDB.getInvites().map((i) => {
        if (i.inviteCode === code) {
          return { ...i, status: 'used' as const, usedAt: new Date().toISOString() };
        }
        return i;
      });
      CustomersDB.saveInvites(invites);
      resolve();
    });
  }

  static async registerCustomer(customerData: Omit<Customer, 'id' | 'joinedAt'>): Promise<Customer> {
    return new Promise((resolve) => {
      const customers = CustomersDB.getCustomers();
      const newCust: Customer = {
        ...customerData,
        id: `cust-${Date.now()}`,
        joinedAt: new Date().toISOString().split('T')[0],
      };
      customers.push(newCust);
      CustomersDB.saveCustomers(customers);
      resolve(newCust);
    });
  }

  static async deleteCustomer(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const customers = CustomersDB.getCustomers().filter((c) => c.id !== id);
        CustomersDB.saveCustomers(customers);
        resolve(true);
      }, 300);
    });
  }
}
