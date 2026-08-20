import { CustomersDB } from '../../services/customers-db';
import { CustomerTask, TaskComment } from '../../types/domain.types';

export class CustomerTasksApi {
  static async fetchByCustomer(customerId: string): Promise<CustomerTask[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = CustomersDB.getTasks().filter((t) => t.customerId === customerId);
        resolve(tasks);
      }, 200);
    });
  }

  static async createTask(task: Omit<CustomerTask, 'id' | 'createdAt'>): Promise<CustomerTask> {
    return new Promise((resolve) => {
      const tasks = CustomersDB.getTasks();
      const newT: CustomerTask = {
        ...task,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      tasks.push(newT);
      CustomersDB.saveTasks(tasks);
      resolve(newT);
    });
  }

  static async updateTaskStatus(taskId: string, status: CustomerTask['status']): Promise<CustomerTask> {
    return new Promise((resolve, reject) => {
      const tasks = CustomersDB.getTasks();
      const taskIndex = tasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return reject(new Error('Task not found'));

      const updated = {
        ...tasks[taskIndex],
        status,
        completedAt: status === 'completed' ? new Date().toISOString().split('T')[0] : undefined,
      };
      tasks[taskIndex] = updated;
      CustomersDB.saveTasks(tasks);
      resolve(updated);
    });
  }

  static async addProofMedia(taskId: string, mediaUrl: string): Promise<CustomerTask> {
    return new Promise((resolve, reject) => {
      const tasks = CustomersDB.getTasks();
      const taskIndex = tasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return reject(new Error('Task not found'));

      const currentMedia = tasks[taskIndex].proofMedia || [];
      const updated = {
        ...tasks[taskIndex],
        proofMedia: [...currentMedia, mediaUrl],
      };
      tasks[taskIndex] = updated;
      CustomersDB.saveTasks(tasks);
      resolve(updated);
    });
  }

  static async addComment(taskId: string, authorName: string, text: string): Promise<CustomerTask> {
    return new Promise((resolve, reject) => {
      const tasks = CustomersDB.getTasks();
      const taskIndex = tasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return reject(new Error('Task not found'));

      const currentComments = tasks[taskIndex].comments || [];
      const newComment: TaskComment = {
        id: `cmt-${Date.now()}`,
        authorName,
        text,
        createdAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };

      const updated = {
        ...tasks[taskIndex],
        comments: [...currentComments, newComment],
      };
      tasks[taskIndex] = updated;
      CustomersDB.saveTasks(tasks);
      resolve(updated);
    });
  }
}
