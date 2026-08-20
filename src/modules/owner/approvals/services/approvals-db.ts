import { ApprovalItem, ApprovalAttachment } from '../types/approvals.types';

const INITIAL_APPROVALS: ApprovalItem[] = [
  {
    id: 'appr-1',
    title: 'فاتورة مورد — Meta Ads',
    detail: '٨,٤٠٠ جنيه · Media Buying',
    description: 'تم السحب الآلي لفاتورة إعلانات فيسبوك وإنستغرام لحملات التحويل الرقمي للعميل سارة حسام. نحتاج اعتماد الصرف المالي للمورد.',
    category: 'invoice',
    requesterName: 'يوسف الشريف',
    requesterRole: 'منفذ إعلانات',
    department: 'قسم الميديا والتسويق',
    status: 'pending',
    createdAt: '2026-08-20 14:30',
    amount: '8,400 EGP',
    attachments: [
      { id: 'att-1', name: 'Meta_Ads_Receipt_Aug2026.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', uploadedAt: '2026-08-20 14:30', size: '1.2 MB' }
    ]
  },
  {
    id: 'appr-2',
    title: 'عرض سعر عميل جديد — Nour Store',
    detail: '١٥,٠٠٠ جنيه · Sales',
    description: 'عرض سعر مخصص لباقة الهوية الرقمية الشاملة وإطلاق المتجر الإلكتروني لعميل Nour Store.',
    category: 'proposal',
    requesterName: 'سهى محمد',
    requesterRole: 'مبيعات وتطوير أعمال',
    department: 'قسم المبيعات',
    status: 'pending',
    createdAt: '2026-08-20 12:15',
    amount: '15,000 EGP',
    attachments: [
      { id: 'att-2', name: 'Proposal_NourStore_v2.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', uploadedAt: '2026-08-20 12:15', size: '2.4 MB' }
    ]
  },
  {
    id: 'appr-3',
    title: 'طلب إجازة اعتيادية — أحمد العتيبي (Dev)',
    detail: '٣ أيام من ٢٩ يوليو إلى ٣١ يوليو',
    description: 'أرغب في تقديم طلب إجازة سنوية اعتيادية لمدة 3 أيام لظروف عائلية خاصة، مع تسليم كافة تاسكات السيرفر للمهندس يوسف.',
    category: 'leave',
    requesterName: 'أحمد العتيبي',
    requesterRole: 'مطور واجهات وسيرفرات',
    department: 'قسم البرمجيات والتطوير',
    status: 'pending',
    createdAt: '2026-08-19 16:45',
    leaveStartDate: '2026-08-29',
    leaveEndDate: '2026-08-31',
    leaveDaysCount: 3,
    attachments: [
      { id: 'att-3', name: 'Handover_Tasks_Summary.docx', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', uploadedAt: '2026-08-19 16:45', size: '450 KB' }
    ]
  },
  {
    id: 'appr-4',
    title: 'اعتماد محتوى — حملة أغسطس التسويقية',
    detail: 'Marketing Content Approval',
    description: 'اعتماد تصاميم ونصوص 12 منشور إعلاني مخصص لمنصات السوشيال ميديا قبل الجدولة والنشر.',
    category: 'content',
    requesterName: 'مريم علي',
    requesterRole: 'كاتبة محتوى',
    department: 'قسم التسويق والمحتوى',
    status: 'pending',
    createdAt: '2026-08-19 10:00',
    attachments: [
      { id: 'att-4', name: 'August_Campaign_Design_Brief.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', uploadedAt: '2026-08-19 10:00', size: '5.1 MB' }
    ]
  },
  {
    id: 'appr-5',
    title: 'طلب استرجاع — Mona Beauty',
    detail: '١,٢٠٠ جنيه · Support Refund',
    description: 'طلب استرداد جزء من رسوم باقة الاستشارة بسبب إلغاء الجلسة الثانية بناء على طلب العميل.',
    category: 'refund',
    requesterName: 'عمر خالد',
    requesterRole: 'أخصائي خدمة عملاء',
    department: 'قسم خدمة العملاء',
    status: 'pending',
    createdAt: '2026-08-18 11:30',
    amount: '1,200 EGP',
    attachments: []
  },
  {
    id: 'appr-6',
    title: 'فاتورة استضافة سنوية — AWS Cloud',
    detail: '٤,٢٠٠ جنيه · Finance',
    description: 'رسوم تجديد السيرفرات السحابية وقواعد بيانات Firebase السنوية.',
    category: 'invoice',
    requesterName: 'يوسف الشريف',
    requesterRole: 'مدير البنية التحتية',
    department: 'قسم البرمجيات والتطوير',
    status: 'approved',
    createdAt: '2026-08-15 09:00',
    amount: '4,200 EGP',
    reviewNote: 'تمت المراجعة والاعتماد المالي وإجراء التحويل بنجاح.',
    reviewedAt: '2026-08-15 11:20',
    reviewedBy: 'م. أحمد العتيبي (المالك)',
    attachments: []
  },
];

export class ApprovalsDB {
  private static STORAGE_KEY = 'cos_approval_items';

  static getApprovals(): ApprovalItem[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(INITIAL_APPROVALS));
      return INITIAL_APPROVALS;
    }
    return JSON.parse(stored);
  }

  static saveApprovals(items: ApprovalItem[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('approvals_updated'));
  }

  static addApproval(item: Omit<ApprovalItem, 'id' | 'createdAt' | 'status'>): ApprovalItem {
    const items = this.getApprovals();
    const newItem: ApprovalItem = {
      ...item,
      id: `appr-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    items.unshift(newItem);
    this.saveApprovals(items);
    return newItem;
  }

  static updateStatus(id: string, status: 'approved' | 'rejected', reviewNote?: string, reviewerName = 'مدير النظام'): ApprovalItem | null {
    const items = this.getApprovals();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return null;

    items[idx].status = status;
    items[idx].reviewNote = reviewNote;
    items[idx].reviewedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    items[idx].reviewedBy = reviewerName;

    this.saveApprovals(items);
    return items[idx];
  }

  static addAttachment(id: string, attachment: Omit<ApprovalAttachment, 'id' | 'uploadedAt'>): ApprovalItem | null {
    const items = this.getApprovals();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return null;

    const newAtt: ApprovalAttachment = {
      ...attachment,
      id: `att-${Date.now()}`,
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    items[idx].attachments.push(newAtt);
    this.saveApprovals(items);
    return items[idx];
  }
}
