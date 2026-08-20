import { Message } from '../types/domain.types';

export interface AISummaryResult {
  summary: string;
  suggestedTasks: string[];
}

export class AISummarizerApi {
  /**
   * Parses active conversation messages history to compile action checklists.
   */
  static async summarizeMessages(messages: Message[]): Promise<AISummaryResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const textDump = messages.map((m) => `${m.senderName}: ${m.text}`).join('\n');

        let summary = 'القسم يبحث تأجيل الحملة ومتابعة التصاميم المتأخرة للعملاء.';
        let tasks = [
          'متابعة إنهاء تصميم لوجو سارة حسام',
          'مراجعة معايير الاستهداف لحملة رمضان النشطة',
        ];

        if (textDump.includes('sales') || textDump.includes('صفقة')) {
          summary = 'تم إغلاق صفقة Nour Store بقيمة 15,000 جنيه بنجاح.';
          tasks = ['متابعة توقيع العقد النهائي مع عملاء Nour Store'];
        }

        resolve({
          summary,
          suggestedTasks: tasks,
        });
      }, 300);
    });
  }
}
