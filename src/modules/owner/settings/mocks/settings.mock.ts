import {
  SettingsCategory,
  SettingItem,
  UserItem,
  DepartmentItem,
  AuditLogItem,
  AutomationRule,
  InviteLink,
  JourneyStage,
  TaskTemplate,
  SlaRule,
  AlertRule,
  ApprovalRule
} from '../types/settings.types';

export const settingsCategories: SettingsCategory[] = [
  { id: 'general', title: 'عام - General', icon: 'Settings', description: 'إعدادات النظام العامة واللغة والمظهر' },
  { id: 'organization', title: 'المؤسسة - Organization', icon: 'Building2', description: 'معلومات الكيان والبيانات القانونية ومواعيد العمل' },
  { id: 'branding', title: 'الهوية البصرية - Branding', icon: 'Palette', description: 'الشعارات، الألوان المخصصة ومعاينة الهوية' },
  { id: 'users', title: 'المستخدمين - Users', icon: 'Users', description: 'إدارة حسابات الموظفين والعملاء وتحديث أدوارهم' },
  { id: 'roles-permissions', title: 'الأدوار والصلاحيات - Roles', icon: 'ShieldAlert', description: 'مصفوفة التحكم بصلاحيات RBAC ونطاق الوصول' },
  { id: 'departments', title: 'الأقسام - Departments', icon: 'Briefcase', description: 'تهيئة الأقسام ومدراء الأفرع وأهداف التشغيل' },
  { id: 'customer-settings', title: 'إعدادات العملاء - Customers', icon: 'UserCheck', description: 'التسجيل والتحقق والروابط التلقائية ودعوات الانضمام' },
  { id: 'invite-settings', title: 'إعدادات الدعوات - Invites', icon: 'Mail', description: 'سياسات وصلاحية روابط تسجيل الموظفين والعملاء الجدد' },
  { id: 'journey-stages', title: 'مراحل رحلة العميل - Journey', icon: 'Map', description: 'تهيئة مسارات العمل والتحول التلقائي بين المراحل' },
  { id: 'tasks-templates', title: 'المهام والقوالب - Tasks', icon: 'ListTodo', description: 'أوقات الإنجاز المتوقعة SLA وقوالب المهام المتكررة' },
  { id: 'assignment-engine', title: 'محرك التوزيع - Assignments', icon: 'GitMerge', description: 'استراتيجيات توزيع المهام والعملاء التلقائية' },
  { id: 'calendar-availability', title: 'التقويم والمواعيد - Availability', icon: 'CalendarDays', description: 'أوقات العمل المتاحة، الحجوزات وفترات الراحة' },
  { id: 'appointments', title: 'اللقاءات والمكالمات - Appointments', icon: 'PhoneCall', description: 'سياسات الإلغاء وتأجيل المواعيد وجلسات العمل' },
  { id: 'sla', title: 'اتفاقية مستوى الخدمة - SLA', icon: 'Clock', description: 'تحديد فترات الاستجابة وحل التذاكر وقواعد التصعيد' },
  { id: 'notifications', title: 'الإشعارات - Notifications', icon: 'BellRing', description: 'قنوات التواصل والرسائل التلقائية عبر الواتساب والبريد' },
  { id: 'alerts', title: 'التنبيهات والتحذيرات - Alerts', icon: 'AlertOctagon', description: 'قواعد التنبيه التشغيلية عند تعثر المهام أو تراجع الأداء' },
  { id: 'automation', title: 'أتمتة العمليات - Automation', icon: 'Zap', description: 'منشئ قواعد الأتمتة الذكي: شروط وإجراءات فورية' },
  { id: 'approvals', title: 'الموافقات والاعتمادات - Approvals', icon: 'CheckSquare', description: 'سلاسل الاعتماد المالي والفني والتصعيد التلقائي' },
  { id: 'content-cms', title: 'إدارة المحتوى - CMS', icon: 'FileText', description: 'الفيديوهات والمستندات التعليمية وشروط النشر للمراحل' },
  { id: 'knowledge-base', title: 'قاعدة المعرفة - Knowledge Base', icon: 'BookOpen', description: 'أرشفة SOPs والسياسات والاستخراج التلقائي من المحادثات' },
  { id: 'collaboration', title: 'إعدادات التعاون - Collaboration', icon: 'MessageSquareText', description: 'القنوات العامة وخاصية تحويل الرسائل لمهام' },
  { id: 'ai-settings', title: 'إعدادات الذكاء الاصطناعي - AI', icon: 'Bot', description: 'الموديل الافتراضي، درجات الاستجابة وصلاحيات الاستدعاء' },
  { id: 'ai-agents', title: 'وكلاء الـ AI - Agents', icon: 'Cpu', description: 'إعداد وتوجيه الوكلاء المتخصصين مثل وكيل التشغيل والمالية' },
  { id: 'ai-tools', title: 'أدوات الـ AI - Tools', icon: 'Wrench', description: 'منح وكلاء الـ AI صلاحية قراءة الجداول وإنشاء المهام' },
  { id: 'ai-policies', title: 'سياسات أمان الـ AI - Policies', icon: 'UserCheck', description: 'التأكيد البشري قبل المعاملات الحساسة وسياسة حماية البيانات' },
  { id: 'performance-analytics', title: 'التحليلات والمؤشرات - Analytics', icon: 'LineChart', description: 'تعريف المقاييس ومصادر البيانات وتحديث التقارير' },
  { id: 'performance-scoring', title: 'أوزان الأداء - Score Weights', icon: 'Award', description: 'معادلة حساب تقييم الأقسام والموظفين التشغيلية' },
  { id: 'executive-reports', title: 'التقارير التنفيذية - Executive Reports', icon: 'PieChart', description: 'توزيع التقارير الدورية للملاك بصيغة تفاعلية' },
  { id: 'financial-settings', title: 'الإعدادات المالية - Finance', icon: 'DollarSign', description: 'فئات المصاريف، شروط السداد والعملات المعتمدة' },
  { id: 'customer-portal', title: 'بوابة العميل - Portal', icon: 'MonitorSmartphone', description: 'عناصر واجهة العميل والخواص المفعلة له' },
  { id: 'security', title: 'الأمان والحماية - Security', icon: 'Lock', description: 'سياسة كلمة المرور والتحقق الثنائي MFA وجلسات المستخدمين' },
  { id: 'privacy', title: 'الخصوصية والبيانات - Privacy', icon: 'Fingerprint', description: 'فترات الاحتفاظ بالبيانات وسجل التدقيق وسياسات الحذف' },
  { id: 'sessions', title: 'الجلسات والتوثيق - Sessions', icon: 'Activity', description: 'مهلة انتهاء الجلسات وعدد الاتصالات المتزامنة' },
  { id: 'files-storage', title: 'الملفات والتخزين - Files', icon: 'HardDrive', description: 'الحد الأقصى لحجم الملفات، الامتدادات المقبولة ومزود الخدمة' },
  { id: 'integrations', title: 'سوق التكاملات - Integrations', icon: 'Grid', description: 'ربط المنصات الخارجية والتقاويم وأنظمة الاتصال' },
  { id: 'email', title: 'البريد الإلكتروني - Email', icon: 'Mail', description: 'SMTP خادم إرسال البريد وقوالب المراسلات المعتمدة' },
  { id: 'whatsapp', title: 'واتساب بيزنس - WhatsApp', icon: 'MessageCircle', description: 'حساب الأعمال وتوثيق قوالب إشعارات العميل' },
  { id: 'facebook', title: 'فيسبوك وتتبع الإعلانات - Facebook', icon: 'Facebook', description: 'ربط البكسل ومتابعة أداء الحملات التسويقية' },
  { id: 'calendar-integrations', title: 'تكامل التقويم - Calendars', icon: 'Calendar', description: 'مزامنة الحجوزات مع Google Calendar و Outlook' },
  { id: 'api', title: 'مفاتيح API - Keys', icon: 'KeyRound', description: 'إصدار وتحديث مفاتيح الاتصال للأنظمة الخارجية' },
  { id: 'webhooks', title: 'الويب هوكس - Webhooks', icon: 'Webhook', description: 'إرسال التنبيهات الفورية لمواقع الويب الخارجية عند تحديث الحالات' },
  { id: 'audit-logs-setting', title: 'سجلات التدقيق والأمان - Audit Logs', icon: 'Shield', description: 'سجل تتبع أفعال المدراء الحساسة بالتوقيت والتفاصيل' },
  { id: 'feature-flags', title: 'أعلام الميزات - Feature Flags', icon: 'Flag', description: 'تشغيل أو تعطيل خواص النظام بشكل تدريجي أو فئات محددة' },
  { id: 'system-preferences', title: 'تفضيلات النظام - Preferences', icon: 'Sliders', description: 'حجم الصفحات الافتراضي، مهلة التخزين المؤقت والتحديث التلقائي' },
  { id: 'localization', title: 'اللغة والأقلمة - Localization', icon: 'Globe2', description: 'إعداد اللغة، العملة المحلية وترتيب الأيام' },
  { id: 'date-time', title: 'التاريخ والوقت - Date & Time', icon: 'Clock3', description: 'صيغ عرض التاريخ والوقت والمنطقة الزمنية الافتراضية' },
  { id: 'backup-data', title: 'النسخ الاحتياطي - Backup', icon: 'DatabaseBackup', description: 'تحميل النسخ الاحتياطية وإعادة ضبط البيانات وتصديرها' },
  { id: 'developer-settings', title: 'المطور وصحة النظام - System Health', icon: 'Terminal', description: 'فحص الاتصال بقواعد البيانات والذاكرة والموديلات' },
  { id: 'danger-zone', title: 'منطقة الخطر - Danger Zone', icon: 'Skull', description: 'أرشفة المؤسسة، مسح شامل للبيانات أو إعادة الضبط التام' }
];

export const mockSettingsItems: SettingItem[] = [
  // General
  { id: 'app_name', category: 'general', group: 'Application', title: 'اسم النظام (Application Name)', description: 'الاسم المعروض للنظام في شريط العنوان ورسائل البريد الإلكتروني', type: 'text', value: 'Company OS', defaultValue: 'Company OS', keywords: ['name', 'title'] },
  { id: 'app_desc', category: 'general', group: 'Application', title: 'وصف النظام (Description)', description: 'شرح مختصر يظهر في الترويسة وبوابات الدخول', type: 'textarea', value: 'نظام إدارة التشغيل والوكلاء المتكامل', defaultValue: 'نظام التشغيل', keywords: ['description', 'about'] },
  { id: 'default_lang', category: 'general', group: 'Application', title: 'اللغة الافتراضية', description: 'اللغة المعتمدة لواجهات النظام عند تسجيل الدخول الجديد', type: 'select', value: 'ar', defaultValue: 'ar', options: [{ label: 'العربية', value: 'ar' }, { label: 'English', value: 'en' }] },
  { id: 'default_timezone', category: 'general', group: 'Application', title: 'المنطقة الزمنية', description: 'توقيت النظام المعتمد في جدولة المهام والاجتماعات', type: 'select', value: 'Asia/Riyadh', defaultValue: 'Asia/Riyadh', options: [{ label: 'مكة المكرمة (Asia/Riyadh)', value: 'Asia/Riyadh' }, { label: 'القاهرة (Africa/Cairo)', value: 'Africa/Cairo' }], keywords: ['timezone', 'time'] },
  { id: 'default_currency', category: 'general', group: 'Application', title: 'العملة الافتراضية', description: 'العملة المستخدمة لعرض الفواتير والتقارير التنفيذية المالية', type: 'select', value: 'SAR', defaultValue: 'SAR', options: [{ label: 'ريال سعودي (SAR)', value: 'SAR' }, { label: 'جنيه مصري (EGP)', value: 'EGP' }], keywords: ['currency', 'money'] },
  { id: 'enable_animations', category: 'general', group: 'Application', title: 'تفعيل الحركات الانتقالية', description: 'تنشيط تأثيرات التحرك المتطورة عبر شاشات التطبيق', type: 'boolean', value: true, defaultValue: true },
  { id: 'sidebar_collapsed', category: 'general', group: 'Interface', title: 'طي القائمة الجانبية افتراضياً', description: 'فتح القائمة الجانبية بشكل مغلق ومصغر عند التحميل الأول', type: 'boolean', value: false, defaultValue: false },
  { id: 'density_mode', category: 'general', group: 'Interface', title: 'كثافة عرض البيانات', description: 'تعديل المسافات وحجم الخلايا في الجداول والبطاقات', type: 'select', value: 'normal', defaultValue: 'normal', options: [{ label: 'مريحة (Comfortable)', value: 'comfortable' }, { label: 'عادية (Normal)', value: 'normal' }, { label: 'مكثفة (Compact)', value: 'compact' }] },

  // Organization
  { id: 'org_name', category: 'organization', group: 'General Info', title: 'اسم المنظمة الرسمي', description: 'الاسم المستخدم في الفواتير والمعاملات الضريبية القانونية', type: 'text', value: 'أكاديمية المستبصرين المحدودة', defaultValue: 'مؤسسة أكاديمية المستبصرين', keywords: ['legal', 'name'] },
  { id: 'org_email', category: 'organization', group: 'Contact', title: 'البريد الإلكتروني للاتصال', description: 'البريد الرسمي المعتمد للتواصل مع العملاء والمستخدمين', type: 'text', value: 'info@upklick.co', defaultValue: 'info@upklick.co' },
  { id: 'org_whatsapp', category: 'organization', group: 'Contact', title: 'رقم الواتساب الرسمي للكيان', description: 'الرقم المفعل لاستقبال رسائل الاستعلام وتنبيهات الأتمتة', type: 'text', value: '+966500000000', defaultValue: '+966500000000' },
  { id: 'tax_number', category: 'organization', group: 'Financials', title: 'الرقم الضريبي للمنشأة', description: 'الرقم المستخدم لتوثيق الفواتير الضريبية وتصدير التقارير', type: 'text', value: '300099485700003', defaultValue: '' },

  // Branding
  { id: 'primary_color', category: 'branding', group: 'Colors', title: 'اللون الأساسي (Primary Color)', description: 'اللون المعتمد للأزرار والعناصر النشطة الهامة', type: 'color', value: '#6366f1', defaultValue: '#6366f1' },
  { id: 'secondary_color', category: 'branding', group: 'Colors', title: 'اللون الثانوي (Secondary Color)', description: 'اللون المعتمد للخلفيات الفرعية والعناصر الثانوية', type: 'color', value: '#06b6d4', defaultValue: '#06b6d4' },
  { id: 'border_radius', category: 'branding', group: 'Dimensions', title: 'زوايا الحواف (Border Radius)', description: 'تعديل انحناء الحواف في كروت الواجهة والمربعات', type: 'select', value: '20px', defaultValue: '20px', options: [{ label: 'حادة (0px)', value: '0px' }, { label: 'انحناء ناعم (12px)', value: '12px' }, { label: 'زجاجية دائرية (20px)', value: '20px' }] },

  // Customer Settings
  { id: 'cust_registration', category: 'customer-settings', group: 'Customer Actions', title: 'Customer Registration (تسجيل العملاء)', description: 'السماح للعملاء بإنشاء حساباتهم مباشرة دون دعوة مسبقة', type: 'boolean', value: true, defaultValue: true },
  { id: 'invite_expiration_days', category: 'customer-settings', group: 'Customer Invites', title: 'Invite Expiration (صلاحية الدعوات)', description: 'عدد الأيام المسموح بها لرابط الدعوة قبل أن يعتبر منتهياً', type: 'number', value: 7, defaultValue: 7 },
  { id: 'whatsapp_validation', category: 'customer-settings', group: 'Validation', title: 'WhatsApp Validation (توثيق الواتساب)', description: 'تأكيد رقم هاتف العميل عبر الواتساب فور التسجيل', type: 'boolean', value: true, defaultValue: true },
  { id: 'email_validation', category: 'customer-settings', group: 'Validation', title: 'Email Validation (توثيق البريد)', description: 'تأكيد البريد الإلكتروني للعميل عبر رمز التفعيل', type: 'boolean', value: true, defaultValue: true },
  { id: 'terms_acceptance', category: 'customer-settings', group: 'Compliance', title: 'Terms Acceptance (الموافقة على الشروط)', description: 'إلزام العميل بالموافقة على اتفاقية الاستخدام قبل دخول البوابة', type: 'boolean', value: true, defaultValue: true },
  { id: 'welcome_experience', category: 'customer-settings', group: 'Experience', title: 'Welcome Experience (شاشة الترحيب)', description: 'عرض مرئي ترحيبي وجولة إرشادية عند أول تسجيل دخول للعميل', type: 'boolean', value: true, defaultValue: true },
  { id: 'jo_assistant', category: 'customer-settings', group: 'Experience', title: 'Jo Assistant (المساعد الذكي جو)', description: 'تنشيط مساعد الذكاء الاصطناعي التفاعلي في بوابة العميل', type: 'boolean', value: true, defaultValue: true },
  { id: 'customer_chat', category: 'customer-settings', group: 'Experience', title: 'Customer Chat (محادثات الدعم)', description: 'تفعيل المحادثة المباشرة الفورية مع موظف التشغيل المسؤول', type: 'boolean', value: true, defaultValue: true },

  // Employee Settings
  { id: 'max_active_tasks_per_employee', category: 'employee-settings', group: 'Limits', title: 'الحد الأقصى للمهام النشطة لكل موظف', description: 'منع إسناد مهام جديدة للموظف إذا تجاوز هذا العدد لتفادي التشتت', type: 'number', value: 5, defaultValue: 5 },

  // Trainer Settings
  { id: 'trainer_round_robin', category: 'trainer-settings', group: 'Allocation Strategy', title: 'تفعيل خوارزمية Round Robin للمدربين', description: 'توزيع حصص التدريب التلقائي بالتناوب الدائري العادل', type: 'boolean', value: true, defaultValue: true },

  // Journey Stages
  { id: 'dynamic_journey_mode', category: 'journey-stages', group: 'Journey Transitions', title: 'تمكين رحلة العميل الديناميكية', description: 'السماح بتخطي المراحل أو الانتقال التلقائي بناءً على إنجاز المهام', type: 'boolean', value: true, defaultValue: true },

  // Tasks Templates
  { id: 'task_default_priority', category: 'tasks-templates', group: 'Task Defaults', title: 'الأولية الافتراضية للمهام الجديدة', description: 'تحديد الأولية التلقائية للمهام المتولدة بواسطة النظام', type: 'select', value: 'medium', defaultValue: 'medium', options: [{ label: 'منخفضة (Low)', value: 'low' }, { label: 'متوسطة (Medium)', value: 'medium' }, { label: 'مرتفعة (High)', value: 'high' }] },

  // Assignment Engine
  { id: 'assignment_strategy', category: 'assignment-engine', group: 'Core Engine', title: 'خوارزمية محرك التوزيع التلقائي للمهام', description: 'طريقة إسناد المهام للموظفين في الأقسام', type: 'select', value: 'least-loaded', defaultValue: 'least-loaded', options: [{ label: 'الأقل حملاً (Least Loaded)', value: 'least-loaded' }, { label: 'التناوب الدائري (Round Robin)', value: 'round-robin' }, { label: 'التوزيع اليدوي (Manual)', value: 'manual' }] },

  // Calendar Availability
  { id: 'booking_buffer_minutes', category: 'calendar-availability', group: 'Booking Rules', title: 'فترة المخزن الاحتياطي بين المواعيد (Buffer)', description: 'الزمن بالدقائق الفاصل بين كل موعدين لمنع التداخل', type: 'number', value: 15, defaultValue: 15 },

  // Appointments
  { id: 'allow_customer_reschedule', category: 'appointments', group: 'Client Policies', title: 'السماح للعميل بتأجيل المواعيد', description: 'تمكين العميل من تغيير الموعد من بوابته الخاصة دون الرجوع للدعم', type: 'boolean', value: true, defaultValue: true },

  // SLA
  { id: 'sla_response_time_critical', category: 'sla', group: 'Response Limits', title: 'زمن الاستجابة الأقصى للتذاكر الحرجة', description: 'المهلة القصوى بالساعات للرد المبدئي على التذاكر الحرجة', type: 'number', value: 2, defaultValue: 2 },

  // Notifications
  { id: 'enable_whatsapp_notifications', category: 'notifications', group: 'Delivery Channels', title: 'تفعيل إشعارات الواتساب الآلية', description: 'إرسال التنبيهات وإيصالات الدفع ورسائل التقدم عبر حساب الأعمال للعملاء', type: 'boolean', value: true, defaultValue: true },

  // Alerts
  { id: 'alert_decline_threshold', category: 'alerts', group: 'Performance Banners', title: 'عتبة التحذير لتراجع أداء الموظف', description: 'تنبيه المدير فوراً عند تراجع تقييم الموظف الأسبوعي عن هذه النسبة', type: 'number', value: 70, defaultValue: 70 },

  // Approvals
  { id: 'invoice_auto_approval_limit', category: 'approvals', group: 'Finance Approvals', title: 'الحد الأقصى للموافقة المالية التلقائية للفواتير', description: 'اعتماد الفواتير ذات المبالغ الأقل من هذه القيمة تلقائياً دون الرجوع للمشرف', type: 'number', value: 5000, defaultValue: 5000 },

  // Content CMS
  { id: 'require_qa_before_publishing', category: 'content-cms', group: 'Quality Assurance', title: 'فرض مراجعة الجودة قبل نشر المقالات/الفيديوهات', description: 'منع نشر أي محتوى لـ CMS دون اعتماد المشرف الفني', type: 'boolean', value: true, defaultValue: true },

  // Knowledge Base
  { id: 'auto_sop_extraction', category: 'knowledge-base', group: 'AI Knowledge base', title: 'الاستخراج التلقائي لمسودات SOP من الشات', description: 'توليد مسودات الأدلة التشغيلية تلقائياً من محادثات الموظفين عند تكرار الإجراءات', type: 'boolean', value: true, defaultValue: true },

  // Collaboration
  { id: 'allow_message_deletion', category: 'collaboration', group: 'Chat Moderation', title: 'السماح للموظفين بحذف رسائلهم المرسلة', description: 'تفعيل خيار حذف الرسائل من الشات العام والخاص', type: 'boolean', value: true, defaultValue: true },

  // AI
  { id: 'enable_ai', category: 'ai-settings', group: 'AI General', title: 'تفعيل محرك الذكاء الاصطناعي', description: 'السماح للوكلاء بالعمل وقراءة البيانات وتوليد التحليلات', type: 'boolean', value: true, defaultValue: true },
  { id: 'default_model', category: 'ai-settings', group: 'AI General', title: 'الموديل الافتراضي المعتمد', description: 'النموذج اللغوي المستخدم لتوليد الأجوبة وملخصات المحادثات', type: 'select', value: 'gpt-4o', defaultValue: 'gpt-4o', options: [{ label: 'GPT-4o (الخيار الموصى به)', value: 'gpt-4o' }, { label: 'Claude 3.5 Sonnet', value: 'claude-3.5' }] },
  { id: 'ai_temp', category: 'ai-settings', group: 'AI General', title: 'درجة حرارة الإبداع (Temperature)', description: 'التحكم في نسبة الابتكار أو الجدية في ردود الذكاء الاصطناعي', type: 'number', value: 0.3, defaultValue: 0.3 },

  // AI Agents
  { id: 'ceo_agent_prompt', category: 'ai-agents', group: 'CEO AI Configurations', title: 'التوجيه الأساسي للرئيس التنفيذي الـ AI', description: 'التعليمات والقواعد التشغيلية الموجهة لأداء الوكيل ذو صلاحيات الملاك', type: 'textarea', value: 'أنت رئيس تنفيذي للشركة. قم بتحليل التقارير التشغيلية واقتراح التعديلات لتحسين الأداء وتفادي تعثر SLA.', defaultValue: 'أنت رئيس تنفيذي للشركة.' },

  // AI Tools
  { id: 'ai_can_create_tasks', category: 'ai-tools', group: 'Capabilities', title: 'السماح للـ AI بإنشاء وإسناد مهام جديدة', description: 'منح الوكلاء صلاحية إضافة بطاقات المهام وإسنادها للموظفين تلقائياً', type: 'boolean', value: true, defaultValue: true },

  // AI Policies
  { id: 'ai_require_human_confirmation', category: 'ai-policies', group: 'Safety Checks', title: 'فرض التأكيد البشري للإجراءات الحساسة', description: 'إظهار نافذة اعتماد للمدير قبل قيام الـ AI بمهام مالية أو حذف عملاء', type: 'boolean', value: true, defaultValue: true },

  // Performance Analytics
  { id: 'analytics_update_frequency', category: 'performance-analytics', group: 'Data Refresh', title: 'معدل تحديث مؤشرات الأداء والتقارير', description: 'سرعة إعادة حساب تقارير الأقسام والمؤشرات الحيوية', type: 'select', value: 'hourly', defaultValue: 'hourly', options: [{ label: 'فوري (Real-time)', value: 'realtime' }, { label: 'كل ساعة (Hourly)', value: 'hourly' }, { label: 'يومي (Daily)', value: 'daily' }] },

  // Performance scoring weights
  { id: 'weight_speed', category: 'performance-scoring', group: 'Performance Formula', title: 'وزن سرعة التنفيذ (Execution Speed)', description: 'حجم تأثير سرعة إنهاء المهام SLA على تقييم الموظف الإجمالي', type: 'number', value: 40, defaultValue: 40, keywords: ['weight', 'performance'] },
  { id: 'weight_quality', category: 'performance-scoring', group: 'Performance Formula', title: 'وزن الجودة (Quality)', description: 'تأثير نسبة الملاحظات وإعادة العمل على تقييم الأداء الإجمالي', type: 'number', value: 25, defaultValue: 25, keywords: ['weight', 'performance'] },
  { id: 'weight_workload', category: 'performance-scoring', group: 'Performance Formula', title: 'وزن الكثافة والعمل (Workload)', description: 'تأثير عدد المهام المكتملة نسبة للموظفين الآخرين في نفس القسم', type: 'number', value: 20, defaultValue: 20 },
  { id: 'weight_stability', category: 'performance-scoring', group: 'Performance Formula', title: 'وزن الاستقرار (Stability)', description: 'نسبة الالتزام بالرد على الرسائل وجلسات الدعم وحضور المواعيد', type: 'number', value: 15, defaultValue: 15 },

  // Executive Reports
  { id: 'send_weekly_executive_report', category: 'executive-reports', group: 'Distribution', title: 'إرسال تقرير الأسبوع التلقائي للملاك والمشرفين', description: 'توليد ملف PDF شامل وإرساله ليلة الأحد من كل أسبوع', type: 'boolean', value: true, defaultValue: true },

  // Financial Settings
  { id: 'tax_rate', category: 'financial-settings', group: 'Taxation', title: 'نسبة ضريبة القيمة المضافة (%)', description: 'نسبة الضريبة المفروضة تلقائياً في عروض الأسعار والفواتير', type: 'number', value: 15, defaultValue: 15 },

  // Customer Portal
  { id: 'enable_client_support_chat', category: 'customer-portal', group: 'Features', title: 'تفعيل شات الدعم المباشر ببوابة العميل', description: 'إظهار نافذة المحادثة المباشرة للعميل للتواصل السريع مع القسم', type: 'boolean', value: true, defaultValue: true },

  // Security
  { id: 'min_password_length', category: 'security', group: 'Authentication Policies', title: 'الحد الأدنى لطول كلمة المرور للمستخدمين', description: 'إلزام المستخدمين الجدد بكلمة مرور لا تقل عن هذا العدد', type: 'number', value: 8, defaultValue: 8 },

  // Privacy
  { id: 'data_retention_years', category: 'privacy', group: 'Compliance', title: 'فترة الاحتفاظ بالبيانات التشغيلية وسجلات التدقيق', description: 'عدد السنوات لحفظ العمليات قبل الأرشفة التلقائية لحماية البيانات', type: 'number', value: 5, defaultValue: 5 },

  // Sessions
  { id: 'session_timeout_minutes', category: 'sessions', group: 'Access Expiration', title: 'زمن إنهاء الجلسة التلقائي عند الخمول', description: 'تسجيل خروج المستخدم تلقائياً بالدقائق عند انقطاع النشاط', type: 'number', value: 60, defaultValue: 60 },

  // Files Storage
  { id: 'max_upload_size_mb', category: 'files-storage', group: 'Quotas', title: 'الحد الأقصى لحجم الملف المرفوع (MB)', description: 'حماية مساحة التخزين بمنع رفع ملفات أكبر من هذا الحد', type: 'number', value: 50, defaultValue: 50 },

  // Email
  { id: 'smtp_port', category: 'email', group: 'SMTP Server', title: 'منفذ إرسال البريد الإلكتروني (SMTP Port)', description: 'منفذ الاتصال الآمن لخادم إرسال المراسلات', type: 'number', value: 587, defaultValue: 587 },

  // WhatsApp
  { id: 'whatsapp_verification_otp', category: 'whatsapp', group: 'OTP & Validation', title: 'إرسال رموز التحقق OTP للعملاء عبر الواتساب', description: 'إجراء فحص أمني لتوثيق الهوية عبر إشعارات الواتساب قبل دخول البوابة', type: 'boolean', value: true, defaultValue: true },

  // Facebook
  { id: 'fb_pixel_id', category: 'facebook', group: 'Marketing conversion', title: 'رقم التعريف Facebook Pixel ID', description: 'كود التتبع المعتمد لمتابعة نتائج وتحويلات الحملات التسويقية', type: 'text', value: '184759302847593', defaultValue: '' },

  // Calendar Integrations
  { id: 'sync_google_calendar', category: 'calendar-integrations', group: 'Sync options', title: 'مزامنة المواعيد مع Google Calendar', description: 'تصدير واستقبال المواعيد تلقائياً لتقاويم الموظفين والعملاء', type: 'boolean', value: true, defaultValue: true },

  // API
  { id: 'api_rate_limit_minute', category: 'api', group: 'Rate limiting', title: 'الحد الأقصى للطلبات بالدقيقة لكل مفتاح API', description: 'منع هجمات الاستعلام المتكرر وتخفيف الحمل على النظام', type: 'number', value: 120, defaultValue: 120 },

  // Webhooks
  { id: 'webhook_retry_limit', category: 'webhooks', group: 'Retries', title: 'عدد مرات إعادة المحاولة عند فشل Webhook', description: 'إرسال الطلب مجدداً في حالة سقوط السيرفر المستهدف', type: 'number', value: 3, defaultValue: 3 },

  // Feature Flags
  { id: 'ff_beta_portal', category: 'feature-flags', group: 'Beta Features', title: 'تفعيل المعاينة التجريبية لبوابة العميل المطورة', description: 'إتاحة الواجهة الجديدة لفئات عشوائية من العملاء لتجربتها والتقييم', type: 'boolean', value: false, defaultValue: false },

  // System Preferences
  { id: 'system_cache_seconds', category: 'system-preferences', group: 'Cache Controls', title: 'فترة الاحتفاظ بالتخزين المؤقت للبيانات (Cache)', description: 'زمن حفظ استعلامات الجداول التشغيلية بالثواني قبل تحديثها', type: 'number', value: 300, defaultValue: 300 },

  // Localization
  { id: 'week_start_day', category: 'localization', group: 'Locale Defaults', title: 'اليوم الأول لبداية أسبوع العمل للجدولة', description: 'تحديد يوم انطلاق جدول المواعيد وحساب أوقات الإنجاز الأسبوعية', type: 'select', value: 'sunday', defaultValue: 'sunday', options: [{ label: 'الأحد (Sunday)', value: 'sunday' }, { label: 'السبت (Saturday)', value: 'saturday' }, { label: 'الإثنين (Monday)', value: 'monday' }] },

  // Date & Time
  { id: 'date_format_preset', category: 'date-time', group: 'Formatting Presets', title: 'صيغة عرض التاريخ في واجهات النظام', description: 'تنسيق عرض الأيام والشهور والسنوات في الجداول والتقارير', type: 'select', value: 'YYYY-MM-DD', defaultValue: 'YYYY-MM-DD', options: [{ label: 'السنة-الشهر-اليوم (YYYY-MM-DD)', value: 'YYYY-MM-DD' }, { label: 'اليوم/الشهر/السنة (DD/MM/YYYY)', value: 'DD/MM/YYYY' }] },

  // Backup & Data
  { id: 'auto_backup_schedule', category: 'backup-data', group: 'DB Backups', title: 'جدول النسخ الاحتياطي التلقائي لقاعدة البيانات', description: 'تكرار حفظ ملفات النظام بالكامل في سحابة التخزين', type: 'select', value: 'daily', defaultValue: 'daily', options: [{ label: 'يومي (Daily)', value: 'daily' }, { label: 'أسبوعي (Weekly)', value: 'weekly' }, { label: 'شهري (Monthly)', value: 'monthly' }] }
];

export const mockUsers: UserItem[] = [
  { id: 'usr-1', name: 'م. أحمد العتيبي', email: 'ahmed@upklick.co', phone: '+966501111111', role: 'Owner', department: 'الادارة العليا', status: 'active', lastLogin: '2026-08-20 02:00', createdAt: '2026-01-01' },
  { id: 'usr-2', name: 'خالد عبد الرحمن', email: 'khaled@upklick.co', phone: '+966502222222', role: 'Manager', department: 'Sales', status: 'active', lastLogin: '2026-08-19 23:45', createdAt: '2026-01-10' },
  { id: 'usr-3', name: 'عمر ياسين', email: 'omar@upklick.co', phone: '+966503333333', role: 'Employee', department: 'Execution', status: 'active', lastLogin: '2026-08-20 01:10', createdAt: '2026-02-15' },
  { id: 'usr-4', name: 'سارة محمد', email: 'sara@upklick.co', phone: '+966504444444', role: 'Trainer', department: 'Support', status: 'active', lastLogin: '2026-08-18 17:30', createdAt: '2026-03-01' },
  { id: 'usr-5', name: 'فيصل الحربي', email: 'faisal@client.com', phone: '+966505555555', role: 'Customer', department: 'خارجي', status: 'active', lastLogin: '2026-08-20 00:05', createdAt: '2026-05-12' },
  { id: 'usr-6', name: 'عبد الله السديري', email: 'abdullah@upklick.co', phone: '+966506666666', role: 'Employee', department: 'Development', status: 'inactive', lastLogin: '2026-08-01 10:20', createdAt: '2026-04-20' }
];

export const mockDepartments: DepartmentItem[] = [
  { id: 'dept-1', name: 'Marketing', description: 'إدارة التسويق الرقمي وبناء الهوية الجماهيرية واستقطاب العملاء', manager: 'سليمان الفهيد', membersCount: 5, status: 'active', color: '#f59e0b', icon: 'Megaphone' },
  { id: 'dept-2', name: 'Sales', description: 'متابعة العروض، تحويل العملاء وتدقيق العقود وسجلات المبيعات المعتمدة', manager: 'خالد عبد الرحمن', membersCount: 4, status: 'active', color: '#10b981', icon: 'DollarSign' },
  { id: 'dept-3', name: 'Execution', description: 'تخطيط وتفعيل الخدمات الممنوحة للعملاء وبناء البنية التحتية المطلوبة', manager: 'رائد الجهني', membersCount: 8, status: 'active', color: '#3b82f6', icon: 'Layers' },
  { id: 'dept-4', name: 'Support', description: 'الرد على الاستفسارات، معالجة التذاكر والدعم الفني المباشر', manager: 'سارة محمد', membersCount: 3, status: 'active', color: '#ef4444', icon: 'LifeBuoy' },
  { id: 'dept-5', name: 'Development', description: 'إدارة التقنيات وكود النظام وأدوات الأتمتة المتقدمة', manager: 'م. أحمد العتيبي', membersCount: 6, status: 'active', color: '#8b5cf6', icon: 'Code' }
];

export const mockAuditLogs: AuditLogItem[] = [
  { id: 'alog-1', timestamp: '2026-08-20 02:05:40', actor: 'م. أحمد العتيبي (Owner)', action: 'تعديل أوزان الأداء', resource: 'Performance Settings', resourceId: 'performance-scoring', before: 'Execution Speed: 40%, Quality: 25%', after: 'Execution Speed: 35%, Quality: 30%', ip: '192.168.1.100', device: 'Chrome / Windows', result: 'success' },
  { id: 'alog-2', timestamp: '2026-08-20 01:50:22', actor: 'خالد عبد الرحمن (Manager)', action: 'إضافة موظف جديد لـ Sales', resource: 'Users', resourceId: 'usr-6', before: 'None', after: 'User abdullah@upklick.co added', ip: '192.168.1.102', device: 'Safari / macOS', result: 'success' },
  { id: 'alog-3', timestamp: '2026-08-19 22:15:10', actor: 'م. أحمد العتيبي (Owner)', action: 'إيقاف تفعيل الوكيل المالي للذكاء الاصطناعي', resource: 'AI Agents', resourceId: 'agent-finance', before: 'Status: Enabled', after: 'Status: Disabled', ip: '192.168.1.100', device: 'Chrome / Windows', result: 'success' }
];

export const mockAutomationRules: AutomationRule[] = [
  { id: 'rule-1', title: 'عند إتمام المهمة التنفيذية الأولى -> تغيير مرحلة العميل تلقائياً إلى Setup', trigger: 'إتمام مهمة (Task Completed)', conditions: 'Task.Order == 1', actions: 'تعديل المرحلة (Change Stage) -> Setup + إرسال واتساب ترحيبي', isActive: true },
  { id: 'rule-2', title: 'تنبيه المدير تلقائياً عبر واتساب عند تأخر استجابة SLA تذكرة الدعم عن ساعتين', trigger: 'تجاوز زمن الاستجابة (SLA Breached)', conditions: 'Ticket.Priority == critical', actions: 'إنشاء تنبيه (Create Alert) + إرسال واتساب للمدير', isActive: true }
];

export const mockInviteLinks: InviteLink[] = [
  { id: 'inv-1', code: 'ACC-JOIN-8XF3', role: 'Trainer', isOneTime: true, expiresAt: '2026-09-01 00:00:00', salesRecord: 'REC-9482', orgMatch: 'Academy', isUsed: false, createdAt: '2026-08-19 12:00:00' },
  { id: 'inv-2', code: 'ACC-JOIN-M7Q9', role: 'Employee', isOneTime: false, expiresAt: '2026-12-31 23:59:59', orgMatch: 'Academy', isUsed: false, createdAt: '2026-08-20 01:30:00' }
];

export const mockJourneyStages: JourneyStage[] = [
  { id: 'stage-reg', name: 'Registration (التسجيل)', description: 'مرحلة فتح الحساب وتدقيق بيانات العميل المبدئية', order: 1, color: '#f59e0b', icon: 'UserCheck', visibility: 'everyone', prerequisites: [], tasks: [], articles: [], videos: [], appointments: [], deliverables: [], automations: [], conditions: [], tasksOpenedOnEntry: true, contentOpenedOnEntry: true, appointmentRequired: false, deliverableRequired: false, approvalRequired: false, qaRequired: false, requiredCompletionPct: 100, autoAdvance: true, manualAdvance: false, blockTransition: false, stageTimeoutHours: 24 },
  { id: 'stage-wel', name: 'Welcome (الترحيب)', description: 'الترحيب بالعميل وإرسال الدليل التوجيهي له', order: 2, color: '#10b981', icon: 'Smile', visibility: 'everyone', prerequisites: ['stage-reg'], tasks: [], articles: [], videos: [], appointments: [], deliverables: [], automations: [], conditions: [], tasksOpenedOnEntry: true, contentOpenedOnEntry: true, appointmentRequired: true, deliverableRequired: false, approvalRequired: false, qaRequired: false, requiredCompletionPct: 100, autoAdvance: true, manualAdvance: false, blockTransition: false, stageTimeoutHours: 48 },
  { id: 'stage-set', name: 'Setup (التهيئة)', description: 'تهيئة الخوادم وشراء النطاق وضبط حسابات العمل', order: 3, color: '#3b82f6', icon: 'Settings', visibility: 'everyone', prerequisites: ['stage-wel'], tasks: [], articles: [], videos: [], appointments: [], deliverables: [], automations: [], conditions: [], tasksOpenedOnEntry: true, contentOpenedOnEntry: true, appointmentRequired: false, deliverableRequired: true, approvalRequired: true, qaRequired: true, requiredCompletionPct: 100, autoAdvance: true, manualAdvance: false, blockTransition: false, stageTimeoutHours: 72 },
  { id: 'stage-exec', name: 'Execution (التنفيذ)', description: 'البدء بتصميم وتطوير النظام وربط وكلاء الذكاء الاصطناعي', order: 4, color: '#8b5cf6', icon: 'Code', visibility: 'everyone', prerequisites: ['stage-set'], tasks: [], articles: [], videos: [], appointments: [], deliverables: [], automations: [], conditions: [], tasksOpenedOnEntry: true, contentOpenedOnEntry: false, appointmentRequired: false, deliverableRequired: true, approvalRequired: true, qaRequired: true, requiredCompletionPct: 80, autoAdvance: false, manualAdvance: true, blockTransition: false, stageTimeoutHours: 120 },
  { id: 'stage-rev', name: 'Review (المراجعة)', description: 'مراجعة المخرجات مع العميل وتدوين الملاحظات البرمجية', order: 5, color: '#ec4899', icon: 'Eye', visibility: 'everyone', prerequisites: ['stage-exec'], tasks: [], articles: [], videos: [], appointments: [], deliverables: [], automations: [], conditions: [], tasksOpenedOnEntry: true, contentOpenedOnEntry: true, appointmentRequired: true, deliverableRequired: false, approvalRequired: false, qaRequired: false, requiredCompletionPct: 100, autoAdvance: true, manualAdvance: false, blockTransition: false, stageTimeoutHours: 48 },
  { id: 'stage-del', name: 'Delivery (التسليم)', description: 'نقل النظام للإنتاج وتسليم لوحات الملاك والتوثيق', order: 6, color: '#06b6d4', icon: 'CheckCircle', visibility: 'everyone', prerequisites: ['stage-rev'], tasks: [], articles: [], videos: [], appointments: [], deliverables: [], automations: [], conditions: [], tasksOpenedOnEntry: true, contentOpenedOnEntry: true, appointmentRequired: false, deliverableRequired: true, approvalRequired: true, qaRequired: true, requiredCompletionPct: 100, autoAdvance: true, manualAdvance: false, blockTransition: false, stageTimeoutHours: 24 },
  { id: 'stage-fin', name: 'Final Call (المكالمة الختامية)', description: 'الاجتماع النهائي لتقييم الرضا والاتفاق على التشغيل', order: 7, color: '#f97316', icon: 'Phone', visibility: 'everyone', prerequisites: ['stage-del'], tasks: [], articles: [], videos: [], appointments: [], deliverables: [], automations: [], conditions: [], tasksOpenedOnEntry: false, contentOpenedOnEntry: false, appointmentRequired: true, deliverableRequired: false, approvalRequired: false, qaRequired: false, requiredCompletionPct: 100, autoAdvance: true, manualAdvance: false, blockTransition: false, stageTimeoutHours: 24 },
  { id: 'stage-sup', name: 'Support (الدعم الفني)', description: 'خدمات الضمان والدعم التشغيلي المستمر وتذاكر التعديل', order: 8, color: '#ef4444', icon: 'LifeBuoy', visibility: 'everyone', prerequisites: ['stage-fin'], tasks: [], articles: [], videos: [], appointments: [], deliverables: [], automations: [], conditions: [], tasksOpenedOnEntry: true, contentOpenedOnEntry: true, appointmentRequired: false, deliverableRequired: false, approvalRequired: false, qaRequired: false, requiredCompletionPct: 50, autoAdvance: false, manualAdvance: true, blockTransition: false, stageTimeoutHours: 720 },
  { id: 'stage-post', name: 'Post Delivery (ما بعد التسليم)', description: 'متابعة النمو وعرض ميزات الذكاء الاصطناعي الإضافية', order: 9, color: '#64748b', icon: 'ArrowUpRight', visibility: 'everyone', prerequisites: ['stage-sup'], tasks: [], articles: [], videos: [], appointments: [], deliverables: [], automations: [], conditions: [], tasksOpenedOnEntry: false, contentOpenedOnEntry: true, appointmentRequired: false, deliverableRequired: false, approvalRequired: false, qaRequired: false, requiredCompletionPct: 0, autoAdvance: false, manualAdvance: true, blockTransition: false, stageTimeoutHours: 1440 }
];

export const mockTaskTemplates: TaskTemplate[] = [
  { id: 't-temp-1', title: 'إعداد حساب الاستضافة والسيرفر', description: 'تهيئة مساحة التخزين وحساب الـ VPS ونقل قواعد البيانات الأساسية', role: 'Employee', department: 'Execution', customerStage: 'stage-set', trigger: 'Stage Entered', expectedDurationHours: 12, maxDurationHours: 24, priority: 'high', dependencies: [], requiredFiles: ['Server Details'], requiredApproval: true, requiredQa: true, slaEnabled: true, automationEnabled: true, notificationEnabled: true },
  { id: 't-temp-2', title: 'شراء وتفعيل النطاق (Domain Registration)', description: 'حجز النطاق الرسمي باسم العميل وربطه بالخادم الرئيسي وتفعيل شهادة SSL', role: 'Employee', department: 'Sales', customerStage: 'stage-set', trigger: 'Domain Purchased', expectedDurationHours: 4, maxDurationHours: 12, priority: 'medium', dependencies: [], requiredFiles: [], requiredApproval: false, requiredQa: false, slaEnabled: true, automationEnabled: false, notificationEnabled: true }
];

export const mockSlaRules: SlaRule[] = [
  { id: 'sla-1', category: 'Technical Issue', responseTimeHours: 1, resolutionTimeHours: 8, priority: 'critical', escalationRole: 'Manager', notificationEnabled: true, owner: 'Development', workingHoursOnly: false },
  { id: 'sla-2', category: 'General Inquiry', responseTimeHours: 4, resolutionTimeHours: 24, priority: 'low', escalationRole: 'Employee', notificationEnabled: true, owner: 'Support', workingHoursOnly: true }
];

export const mockAlertRules: AlertRule[] = [
  { id: 'alr-1', trigger: 'Task Overdue', severity: 'critical', actions: ['Notification', 'WhatsApp', 'AI Analysis'], isActive: true },
  { id: 'alr-2', trigger: 'SLA Exceeded', severity: 'critical', actions: ['Notification', 'Email', 'Escalate'], isActive: true }
];

export const mockApprovalRules: ApprovalRule[] = [
  { id: 'apr-1', type: 'Invoice', approverRole: 'Manager', level: 1, isSequential: true, autoEscalationHours: 24, reasonRequired: true, commentsRequired: true, slaHours: 12 },
  { id: 'apr-2', type: 'Leave', approverRole: 'Owner', level: 2, isSequential: true, autoEscalationHours: 48, reasonRequired: true, commentsRequired: false, slaHours: 24 }
];
