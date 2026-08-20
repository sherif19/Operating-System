# Company OS — نظام تشغيل الموارد والشركات الموحد

نظام تشغيل موحّد لإدارة الشركات، الأكاديميات، العملاء، والفرق باستخدام **React + TypeScript + Vite + Firebase**.

---

## 🏛️ المبادئ المعمارية الحاكمة (Architecture Overview)

1. **Feature Isolation & Module Boundary**:
   كل وحدة في النظام (`src/modules/*`) معزولة بذاتها وتحتوي على مكوناتها، صفحاتها، الـ Hooks والـ Services الخاصة بها.

2. **Strict Public API**:
   لا يُسمح بالوصول إلى الملفات الداخلية للوحدات إلا عبر `index.ts` الخاص بالوحدة.

3. **RBAC & Data Isolation**:
   الصلاحيات مفروضة على مستويين (الواجهة والخادم). بيانات العميل معزولة عن بيانات الموظف والتحليل الداخلي.

4. **RTL-First & Modern Motion**:
   التصميم يدعم اللغة العربية افتراضياً (RTL) مع حركات سلسة باستخدام Motion for React والوضع الداكن الحديث.

---

## 📁 هيكل المشروع والمسؤوليات (Directory Responsibilities)

```text
src/
├── app/                  # مستوى تشغيل التطبيق (Routes, Layouts, Guards, Providers)
├── assets/               # الأصول الثابتة والصور والأيقونات
├── components/           # المكونات العامة الملموسة فقط (ui, layout, navigation, feedback)
├── modules/              # الوحدات الوظيفية المستقلة (Self-contained Modules)
│   ├── authentication/   # تسجيل الدخول، التحقق، ورجوع الدعوة
│   ├── client-portal/    # واجهة رحلة العميل بالكامل
│   ├── employee-portal/  # مساحة عمل الموظفين والواجبات
│   ├── management/       # لوحة مدراء الأقسام والتحليل
│   ├── owner/            # مركز القيادة التنفيذي للمالك
│   ├── ai-brain/         # عقل الذكاء الاصطناعي والمستشارين والـ Artifacts
│   ├── automations/      # مركز قواعد الأتمتة والمحركات
│   ├── departments/      # الأقسام التشغيلية
│   ├── customers/        # سجلات وقواعد العملاء
│   ├── knowledge-base/   # قاعدة المعرفة المقروءة والـ SOPs
│   ├── collaboration/    # القنوات والمحادثات والمثبتات
│   └── finance/          # المالية والميزانيات
├── features/             # الميزات المشتركة المركبة (like Tasks engine, Performance metrics)
├── lib/                  # المكتبات وإعدادات الـ Motion والـ Firebase والـ Permissions
├── services/             # الخدمات العامة
├── stores/               # إدارة الحالة عبر Zustand (Auth, UI)
├── types/                # التعريفات العامة للشكل البرمجي
└── styles/               # الثيم والتنسيقات الرئيسية (Tailwind v4)
```

---

## 🚀 كيفية تشغيل التطبيق محلياً

```bash
# 1. تثبيت الحزم
npm install

# 2. تشغيل سيرفر التطوير
npm run dev
```

يعمل السيرفر افتراضياً على: `http://localhost:3000`
