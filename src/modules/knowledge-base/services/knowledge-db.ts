import { KnowledgeDocument, KnowledgeVersion, KnowledgeGapLog } from '../types/domain.types';

const INITIAL_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'doc-1',
    title: 'دليل SOP-01: إجراءات مكالمة الانطلاق وجدولة العملاء',
    slug: 'sop-01-kickoff-calls',
    summary: 'خطوات العمل القياسية الخاصة بالمدربين عند بدء رحلة عميل جديد وجدولة المكالمات وتوزيع الصلاحيات.',
    body: `إجراءات مكالمة الانطلاق ومتابعة العميل:
1. يتم إشعار المدرب المعني آلياً عبر محرك Round Robin بمجرد تسجيل العميل.
2. يجب جدولة مكالمة الانطلاق (Kickoff Call) خلال فترة لا تتجاوز 48 ساعة.
3. خلال المكالمة، يتم ملء ملف البيانات المرجعية للعميل (Brief) وحفظه في القسم المخصص.
4. أي تأخير في جدولة المكالمة ينعكس سلباً على تقييم SLA وصحة العميل التشغيلية (Health Indicator).`,
    type: 'SOP',
    authorId: 'emp-1',
    departmentId: 'dept-coaching',
    category: 'التدريب والاستشارات',
    tags: ['SOP', 'Coaching', 'Kickoff', 'SLA'],
    status: 'published',
    version: 1,
    createdAt: '2026-08-01',
    updatedAt: '2026-08-01',
    reviewDate: '2026-11-01',
    visibility: 'employee',
    feedbackScore: { helpful: 14, unhelpful: 0 },
  },
  {
    id: 'doc-2',
    title: 'دليل SOP-02: معايير تسليم الهوية البصرية وتصميمات السوشيال ميديا',
    slug: 'sop-02-design-deliveries',
    summary: 'القواعد الفنية والتقنية التي يجب الالتزام بها عند تصميم الشعارات وتسليم ملفات الهويات البصرية للعملاء.',
    body: `القواعد الفنية لقسم التصميم:
1. يجب تصدير كافة الشعارات والمخرجات بصيغ متجهة عالية الجودة (SVG, PDF) بالإضافة لنسخة خلفية شفافة PNG.
2. استخدام نظام الألوان RGB للتصاميم الرقمية ونظام CMYK للمطبوعات بشكل صارم.
3. يجب إخفاء وتعمية أية كلمات مرور أو ملفات استضافة حساسة يتم تسليمها للعميل ومشاركتها عبر بوابة العميل الآمنة فقط.
4. مراجعة التصاميم تتم داخلياً بواسطة رئيس القسم قبل اعتماد النشر النهائي.`,
    type: 'SOP',
    authorId: 'emp-3',
    departmentId: 'dept-design',
    category: 'التصميم والهوية',
    tags: ['Design', 'Brand', 'SOP', 'SLA'],
    status: 'published',
    version: 2,
    createdAt: '2026-08-05',
    updatedAt: '2026-08-10',
    reviewDate: '2026-12-05',
    visibility: 'employee',
    feedbackScore: { helpful: 8, unhelpful: 1 },
  },
  {
    id: 'doc-3',
    title: 'سياسة الاسترجاع والإلغاء المعتمدة للخدمات التشغيلية',
    slug: 'refund-and-cancellation-policy',
    summary: 'السياسة القانونية والمالية الرسمية المعتمدة لحالات طلب إلغاء الاشتراكات التشغيلية أو طلب استرجاع المبالغ.',
    body: `سياسة الإلغاء والاسترجاع المالي:
1. يحق للعميل تقديم طلب استرجاع خلال الـ 14 يوماً الأولى من بدء الخدمة بشرط عدم تسليم أي مخرجات أساسية.
2. يتم تقديم الطلب رسمياً عبر تذكرة دعم فني (Financial Ticket).
3. تُعرض التذكرة على رئيس القسم المالي والمدير التشغيلي لاعتمادها.
4. لا يتم الاسترجاع بعد مرور 30 يوماً على بدء التنفيذ وتخطي مرحلة kickoff.`,
    type: 'POLICY',
    authorId: 'emp-4',
    departmentId: 'dept-support',
    category: 'المالية والقوانين',
    tags: ['Policy', 'Refund', 'Finance', 'SLA'],
    status: 'published',
    version: 1,
    createdAt: '2026-08-01',
    updatedAt: '2026-08-01',
    reviewDate: '2026-11-01',
    visibility: 'managers',
    feedbackScore: { helpful: 22, unhelpful: 0 },
  },
];

const INITIAL_VERSIONS: KnowledgeVersion[] = [
  {
    id: 'v-1',
    documentId: 'doc-2',
    versionNumber: 1,
    body: 'القواعد الفنية لقسم التصميم الأولية.',
    authorId: 'emp-3',
    createdAt: '2026-08-05',
    changeLog: 'النسخة الأولية المقترحة لقواعد التصميم.',
  },
];

const INITIAL_GAPS: KnowledgeGapLog[] = [
  { query: 'كيف أتعامل مع إلغاء العميل للاستضافة؟', searchCount: 8, lastSearchedAt: '2026-08-18', isResolved: false },
];

export class KnowledgeDB {
  static get<T>(key: string, initial: T): T {
    const data = localStorage.getItem(`cos_kb_${key}`);
    if (!data) {
      localStorage.setItem(`cos_kb_${key}`, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  }

  static set<T>(key: string, value: T): void {
    localStorage.setItem(`cos_kb_${key}`, JSON.stringify(value));
  }

  static getDocuments() { return this.get('docs', INITIAL_DOCUMENTS); }
  static saveDocuments(d: KnowledgeDocument[]) { this.set('docs', d); }

  static getVersions() { return this.get('versions', INITIAL_VERSIONS); }
  static saveVersions(v: KnowledgeVersion[]) { this.set('versions', v); }

  static getGaps() { return this.get('gaps', INITIAL_GAPS); }
  static saveGaps(g: KnowledgeGapLog[]) { this.set('gaps', g); }
}
