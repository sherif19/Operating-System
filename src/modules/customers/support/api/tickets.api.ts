import { CustomersDB } from '../../services/customers-db';
import { CustomerSupportTicket, TicketReply } from '../../types/domain.types';

export class CustomerSupportApi {
  static async fetchByCustomer(customerId: string): Promise<CustomerSupportTicket[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tickets = CustomersDB.getTickets().filter((t) => t.customerId === customerId);
        resolve(tickets);
      }, 200);
    });
  }

  static async fetchAll(): Promise<CustomerSupportTicket[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(CustomersDB.getTickets());
      }, 200);
    });
  }

  static async createTicket(
    customerId: string,
    subject: string,
    description: string,
    category: CustomerSupportTicket['category'] = 'technical',
    priority: CustomerSupportTicket['priority'] = 'medium',
    attachments?: string[],
    customerName?: string,
    assignedStaffName?: string
  ): Promise<CustomerSupportTicket> {
    return new Promise((resolve) => {
      const tickets = CustomersDB.getTickets();
      const createdAt = new Date().toISOString();

      const initialReply: TicketReply = {
        id: `rep-${Date.now()}-0`,
        authorName: customerName || 'العميل',
        authorRole: 'client',
        text: description,
        attachments,
        createdAt,
      };

      const newTicket: CustomerSupportTicket = {
        id: `tkt-${Date.now()}`,
        customerId,
        customerName: customerName || 'سارة حسام',
        subject,
        description,
        category,
        priority,
        status: 'open',
        createdAt,
        updatedAt: createdAt,
        assignedStaffName: assignedStaffName || 'يوسف الشريف (منفذ)',
        attachments,
        replies: [initialReply],
      };

      tickets.push(newTicket);
      CustomersDB.saveTickets(tickets);
      resolve(newTicket);
    });
  }

  static async replyToTicket(
    ticketId: string,
    authorName: string,
    authorRole: 'client' | 'staff' | 'system',
    text: string,
    attachments?: string[],
    newStatus?: CustomerSupportTicket['status']
  ): Promise<CustomerSupportTicket> {
    return new Promise((resolve, reject) => {
      const tickets = CustomersDB.getTickets();
      const idx = tickets.findIndex((t) => t.id === ticketId);
      if (idx === -1) return reject(new Error('Ticket not found'));

      const ticket = tickets[idx];
      const createdAt = new Date().toISOString();

      const newReply: TicketReply = {
        id: `rep-${Date.now()}`,
        authorName,
        authorRole,
        text,
        attachments,
        createdAt,
      };

      const updated: CustomerSupportTicket = {
        ...ticket,
        status: newStatus || ticket.status,
        updatedAt: createdAt,
        replies: [...ticket.replies, newReply],
      };

      tickets[idx] = updated;
      CustomersDB.saveTickets(tickets);
      resolve(updated);
    });
  }
}
