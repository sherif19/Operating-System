import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';
import { DepartmentsService, Department } from '../services/departments.service';
import { EmployeesApi } from '@/modules/employees/api/employees.api';
import { useDialogStore } from '@/stores/dialog.store';

const iconMap: Record<string, React.ComponentType<any>> = {
  TrendingUp: Icons.TrendingUp,
  Users: Icons.Users,
  Zap: Icons.Zap,
  AlertTriangle: Icons.AlertTriangle,
  Settings: Icons.Settings,
  Sparkles: Icons.Sparkles,
  BarChart3: Icons.BarChart3,
  Building2: Icons.Building2,
  Megaphone: Icons.Megaphone,
  DollarSign: Icons.DollarSign,
  Layers: Icons.Layers,
  LifeBuoy: Icons.LifeBuoy,
  Code: Icons.Code
};

export function getIcon(iconName: string, className?: string) {
  const IconComponent = iconMap[iconName] || Icons.Building2;
  return <IconComponent className={className} />;
}

const colorStyles: Record<string, { border: string; shadow: string; text: string }> = {
  pink: { border: 'border-pink-500/20 hover:border-pink-500/50', shadow: 'shadow-pink-500/5', text: 'text-pink-400' },
  emerald: { border: 'border-emerald-500/20 hover:border-emerald-500/50', shadow: 'shadow-emerald-500/5', text: 'text-emerald-400' },
  indigo: { border: 'border-indigo-500/20 hover:border-indigo-500/50', shadow: 'shadow-indigo-500/5', text: 'text-indigo-400' },
  rose: { border: 'border-rose-500/20 hover:border-rose-500/50', shadow: 'shadow-rose-500/5', text: 'text-rose-400' },
  cyan: { border: 'border-cyan-500/20 hover:border-cyan-500/50', shadow: 'shadow-cyan-500/5', text: 'text-cyan-400' },
  purple: { border: 'border-purple-500/20 hover:border-purple-500/50', shadow: 'shadow-purple-500/5', text: 'text-purple-400' },
  amber: { border: 'border-amber-500/20 hover:border-amber-500/50', shadow: 'shadow-amber-500/5', text: 'text-amber-400' }
};

export function DepartmentOSPage() {
  const navigate = useNavigate();
  const { showConfirm } = useDialogStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDeptId = searchParams.get('id');

  const setSelectedDeptId = (id: string | null) => {
    if (id) {
      setSearchParams({ id });
    } else {
      setSearchParams({});
    }
  };

  const [activeTab, setActiveTab] = React.useState<string>('dashboard');
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [employees, setEmployees] = React.useState<any[]>([]);

  // Dialog / Modal Form State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingDeptId, setEditingDeptId] = React.useState<string | null>(null);
  
  const [name, setName] = React.useState('');
  const [engName, setEngName] = React.useState('');
  const [status, setStatus] = React.useState<'🟢 نشط' | '🟡 نشط جزئياً' | '🔴 حرج'>('🟢 نشط');
  const [iconName, setIconName] = React.useState('Building2');
  const [color, setColor] = React.useState('indigo');
  const [kpi1Label, setKpi1Label] = React.useState('');
  const [kpi1Value, setKpi1Value] = React.useState('');
  const [kpi2Label, setKpi2Label] = React.useState('');
  const [kpi2Value, setKpi2Value] = React.useState('');

  const loadData = () => {
    setDepartments(DepartmentsService.getDepartments());
  };

  React.useEffect(() => {
    loadData();
    EmployeesApi.fetchAll().then((data) => {
      setEmployees(data);
    });
  }, []);

  const selectedDept = departments.find((d) => d.id === selectedDeptId);

  const handleOpenAddModal = () => {
    setEditingDeptId(null);
    setName('');
    setEngName('');
    setStatus('🟢 نشط');
    setIconName('Building2');
    setColor('indigo');
    setKpi1Label('KPI 1');
    setKpi1Value('0');
    setKpi2Label('KPI 2');
    setKpi2Value('0');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (e: React.MouseEvent, dept: Department) => {
    e.stopPropagation();
    setEditingDeptId(dept.id);
    setName(dept.name);
    setEngName(dept.engName);
    setStatus(dept.status);
    setIconName(dept.iconName);
    setColor(dept.color);
    setKpi1Label(dept.kpis[0]?.label || 'KPI 1');
    setKpi1Value(dept.kpis[0]?.value || '0');
    setKpi2Label(dept.kpis[1]?.label || 'KPI 2');
    setKpi2Value(dept.kpis[1]?.value || '0');
    setIsModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent, id: string, deptName: string) => {
    e.stopPropagation();
    showConfirm(
      'تأكيد حذف القسم بالكامل',
      `🚨 هل أنت متأكد من حذف قسم "${deptName}" بالكامل؟ سيتم إزالة هذا القسم من لوحات القيادة ومن القائمة الجانبية.`,
      () => {
        DepartmentsService.deleteDepartment(id);
        loadData();
        if (selectedDeptId === id) setSelectedDeptId(null);
      }
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      engName,
      status,
      iconName,
      color,
      kpis: [
        { label: kpi1Label, value: kpi1Value },
        { label: kpi2Label, value: kpi2Value }
      ]
    };

    if (editingDeptId) {
      DepartmentsService.updateDepartment(editingDeptId, payload);
    } else {
      DepartmentsService.addDepartment(payload);
    }

    loadData();
    setIsModalOpen(false);
  };

  // Tabs for the inner dashboard
  const innerTabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'employees', label: 'موظفو القسم' },
    { id: 'leads', label: 'Leads' },
    { id: 'crm', label: 'CRM' },
    { id: 'calls', label: 'Calls' },
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'ai-coach', label: 'AI Coach' },
    { id: 'scripts', label: 'Scripts' },
    { id: 'follow-ups', label: 'Follow ups' },
    { id: 'reports', label: 'Reports' },
  ];

  // Motion variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemFade = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 24 } }
  };

  // If no department is selected, render the selection list
  if (!selectedDeptId) {
    return (
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6 text-right"
      >
        {/* Banner */}
        <motion.div
          variants={itemFade}
          className="p-8 rounded-[24px] bg-gradient-to-br from-[#10193E] to-[#0A0F24]/85 border border-blue-500/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.15),transparent_60%)] pointer-events-none" />
          <div className="z-10">
            <Badge variant="default" className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-extrabold px-3 py-1">
              <Icons.Building2 className="w-3.5 h-3.5 me-1.5" />
              نظام تشغيل الأقسام — Department OS
            </Badge>
            <h1 className="text-2xl font-black text-white tracking-tight mt-3">إدارة وتنسيق الأقسام التشغيلية</h1>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed mt-1">
              اختر أحد الأقسام التشغيلية المضافة للشركة لعرض لوحة القيادة (Dashboard)، إدارة العملاء، المؤشرات الخاصة، وتوصيات مدرب الذكاء الاصطناعي.
            </p>
          </div>

          <Button 
            variant="primary" 
            size="md" 
            onClick={handleOpenAddModal}
            className="z-10 bg-indigo-600 hover:bg-indigo-500 gap-1.5 self-start md:self-auto h-10 px-5 shadow-lg shadow-indigo-600/20"
          >
            <Icons.Plus className="w-4.5 h-4.5" />
            <span>إضافة قسم جديد</span>
          </Button>
        </motion.div>

        {/* Departments Grid */}
        <motion.div
          variants={itemFade}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {departments.map((dept) => {
            const styles = colorStyles[dept.color] || colorStyles.indigo;
            return (
              <motion.div
                key={dept.id}
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={() => setSelectedDeptId(dept.id)}
                className={`card p-5 rounded-[20px] border ${styles.border} ${styles.shadow} cursor-pointer flex flex-col justify-between h-48 relative group`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-blue-500/10 shrink-0">
                    {getIcon(dept.iconName, `w-6 h-6 ${styles.text}`)}
                  </div>
                  
                  {/* Action buttons shown on hover */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => handleOpenEditModal(e, dept)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer text-[10px] font-bold"
                      title="تعديل بيانات القسم"
                    >
                      <Icons.Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, dept.id, dept.name)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                      title="حذف القسم"
                    >
                      <Icons.Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <Badge variant="outline" className="text-[9px] border-slate-800 text-slate-400">
                    {dept.status}
                  </Badge>
                </div>

                <div className="mt-3">
                  <h3 className="text-xs font-black text-white">{dept.name}</h3>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{dept.engName} OS</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/60 text-[9px] text-slate-400">
                  {dept.kpis.map((kpi, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span>{kpi.label}</span>
                      <span className="font-extrabold text-white mt-0.5">{kpi.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Dialog Modal for Add/Edit Department */}
        <Dialog
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingDeptId ? 'تعديل بيانات القسم التشغيلي' : 'إضافة قسم تشغيلي جديد'}
          description="أدخل تفاصيل ومسمى القسم التشغيلي لتفعيله بنظام تشغيل المؤسسة."
          className="max-w-md bg-slate-950 border border-slate-800 text-right text-xs"
        >
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div>
              <label className="block mb-1.5 text-slate-400 font-bold">اسم القسم بالعربية</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: قسم التحليل المالي"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-slate-400 font-bold">اسم القسم بالإنجليزية (English name)</label>
              <input
                type="text"
                value={engName}
                onChange={(e) => setEngName(e.target.value)}
                placeholder="مثال: Finance / Marketing"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-left focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1.5 text-slate-400 font-bold">الحالة التشغيلية</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                >
                  <option value="🟢 نشط">🟢 نشط</option>
                  <option value="🟡 نشط جزئياً">🟡 نشط جزئياً</option>
                  <option value="🔴 حرج">🔴 حرج</option>
                </select>
              </div>

              <div>
                <label className="block mb-1.5 text-slate-400 font-bold">نمط اللون المتوهج</label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                >
                  <option value="indigo">Indigo (أزرق غامق)</option>
                  <option value="emerald">Emerald (أخضر)</option>
                  <option value="cyan">Cyan (سماوي)</option>
                  <option value="purple">Purple (بنفسجي)</option>
                  <option value="pink">Pink (وردي)</option>
                  <option value="amber">Amber (ذهبي)</option>
                  <option value="rose">Rose (أحمر)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-slate-400 font-bold">أيقونة القسم (Lucide Icon)</label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
              >
                <option value="Building2">مكتب (Building2)</option>
                <option value="TrendingUp">رسم بياني تصاعدي (TrendingUp)</option>
                <option value="Users">فريق عمل (Users)</option>
                <option value="Zap">صاعقة تشغيل (Zap)</option>
                <option value="AlertTriangle">تحذير / أمان (AlertTriangle)</option>
                <option value="Settings">ترس إعدادات (Settings)</option>
                <option value="Sparkles">بريق ونجوم (Sparkles)</option>
                <option value="BarChart3">مؤشر مالي (BarChart3)</option>
                <option value="Megaphone">مكبر صوت (Megaphone)</option>
                <option value="DollarSign">مالية (DollarSign)</option>
                <option value="Layers">طبقات (Layers)</option>
                <option value="LifeBuoy">دعم وإنقاذ (LifeBuoy)</option>
                <option value="Code">برمجة (Code)</option>
              </select>
            </div>

            <div className="border-t border-slate-900 pt-3 space-y-3">
              <span className="text-[10px] text-slate-500 font-bold block mb-1">تعريف مؤشرات الأداء (KPIs) للقسم:</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={kpi1Label}
                  onChange={(e) => setKpi1Label(e.target.value)}
                  placeholder="مؤشر 1 (مثال: صفقات)"
                  className="bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-slate-200"
                />
                <input
                  type="text"
                  value={kpi1Value}
                  onChange={(e) => setKpi1Value(e.target.value)}
                  placeholder="القيمة (مثال: 14)"
                  className="bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={kpi2Label}
                  onChange={(e) => setKpi2Label(e.target.value)}
                  placeholder="مؤشر 2 (مثال: الالتزام)"
                  className="bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-slate-200"
                />
                <input
                  type="text"
                  value={kpi2Value}
                  onChange={(e) => setKpi2Value(e.target.value)}
                  placeholder="القيمة (مثال: 95%)"
                  className="bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-slate-200"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-10 mt-3 bg-indigo-600 hover:bg-indigo-500">
              {editingDeptId ? 'حفظ التعديلات' : 'إضافة وتفعيل القسم'}
            </Button>
          </form>
        </Dialog>
      </motion.div>
    );
  }

  // If a department is selected, render the inner dashboard
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6 text-right"
    >
      {/* Top Path / Back Button bar */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400 font-bold">
          <span className="cursor-pointer hover:text-white" onClick={() => setSelectedDeptId(null)}>Departments</span>
          <span>/</span>
          <span className="text-white font-extrabold">{selectedDept?.engName}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedDeptId(null)}
          className="gap-2 border-blue-500/20 bg-slate-950/40 text-[10px] cursor-pointer"
        >
          <Icons.ChevronLeft className="w-3.5 h-3.5" />
          <span>العودة لقائمة الأقسام</span>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start min-h-[calc(100vh-180px)]">
        {/* Left Side: AI Copilot Column */}
        <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
          <Card className="p-5 border-blue-500/20 relative overflow-hidden bg-slate-950/80">
            <div className="absolute -left-12 -top-12 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Icons.Bot className="w-4 h-4 text-cyan-400" />
              <span>AI Copilot</span>
            </h3>
            <span className="text-[10px] text-slate-400 block mt-0.5">شريكك في تشغيل القسم</span>

            {/* Warnings */}
            <div className="mt-5 space-y-3">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                تنبيهات مساحة العمل
              </span>
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-300 leading-relaxed">
                🚨 حملة {selectedDept?.engName} Launch بتصرف ميزانية بلا نتيجة
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300 leading-relaxed">
                ⚠️ هناك ملفات معلقة تحتاج مراجعة هذا الأسبوع
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-5 space-y-2">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                توصيات
              </span>
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-300 leading-relaxed">
                💡 فكرة: تقليل فترات انتظار المهام يحسن الأداء العام بالقسم بنسبة 15%.
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-5 space-y-2">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                إجراءات سريعة
              </span>
              <button className="w-full text-right p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/40 text-[10px] text-slate-300 hover:text-white transition-all cursor-pointer">
                📊 تلخيص أداء الأسبوع
              </button>
              <button className="w-full text-right p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/40 text-[10px] text-slate-300 hover:text-white transition-all cursor-pointer">
                📅 جهز التقرير التشغيلي للقسم
              </button>
            </div>

            {/* AI Input Chat */}
            <div className="mt-5 pt-4 border-t border-slate-800/80">
              <input
                type="text"
                placeholder="اسأل الـ AI عن أي حاجة..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder:text-slate-500"
              />
            </div>
          </Card>
        </div>

        {/* Right Side: Main Dashboard Screen */}
        <div className="flex-1 flex flex-col gap-6 w-full min-w-0">
          {/* Dashboard Title & Tabs bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[24px] bg-gradient-to-br from-[#10193E] to-[#0A0F24]/85 border border-blue-500/20 shadow-2xl relative overflow-hidden w-full">
            <div className="flex flex-col gap-1 z-10">
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{selectedDept?.engName} OS</span>
                <span className="text-xs text-indigo-400">({selectedDept?.name})</span>
              </h1>
              <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>الحالة — AI Department Coach نشط 100%</span>
              </p>
            </div>
          </div>

          {/* Horizontal Sub Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800">
            {innerTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-extrabold transition-all border-b-2 shrink-0 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-white bg-slate-900/60'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Tab View */}
          {activeTab === 'dashboard' ? (
            <div className="space-y-6">
              {/* 3 Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-5 flex flex-col justify-between min-h-28">
                  <span className="text-[10px] font-bold text-slate-400">دخل متوقع الشهر</span>
                  <div className="text-2xl font-black text-white mt-2">310K ج</div>
                </Card>
                <Card className="p-5 flex flex-col justify-between min-h-28">
                  <span className="text-[10px] font-bold text-slate-400">معدل الإنجاز</span>
                  <div className="text-2xl font-black text-emerald-400 mt-2">{selectedDept?.kpis[1]?.value || '95%'}</div>
                </Card>
                <Card className="p-5 flex flex-col justify-between min-h-28">
                  <span className="text-[10px] font-bold text-slate-400">المؤشر الرئيسي</span>
                  <div className="text-2xl font-black text-indigo-400 mt-2">{selectedDept?.kpis[0]?.value || '12'}</div>
                </Card>
              </div>

              {/* Objectives & OKRs panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* OKRs */}
                <Card className="p-5">
                  <h3 className="text-xs font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                    <span>أهداف القسم (OKRs)</span>
                  </h3>
                  <div className="space-y-4 text-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-slate-400 font-bold">
                        <span>الهدف الشهري</span>
                        <span className="font-mono text-white">72%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '72%' }} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-slate-400 font-bold">
                        <span>جودة التنفيذ</span>
                        <span className="font-mono text-emerald-400">91%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '91%' }} />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* AI Department Coach */}
                <Card className="p-5 bg-gradient-to-br from-[#10193E] to-slate-950/80 border-cyan-500/25">
                  <h3 className="text-xs font-black text-cyan-400 flex items-center gap-2 border-b border-slate-800/80 pb-3 mb-4">
                    <Icons.Bot className="w-4 h-4" />
                    <span>AI Department Coach</span>
                  </h3>
                  <div className="space-y-3 text-xs text-slate-300">
                    <p className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 leading-relaxed">
                      "فيه ٣ مهام متأخرة عن المتوسط الأسبوعي في القسم ده - عايزين الخصهم؟"
                    </p>
                    <p className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 leading-relaxed">
                      "أداء الأسبوع ده أعلى من المتوسط الشهري بـ 8%."
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          ) : activeTab === 'employees' ? (
            <div className="space-y-6">
              {(() => {
                const deptEmployees = employees.filter((emp) => {
                  const empDept = emp.departmentId?.toLowerCase().replace('dept-', '') || '';
                  const targetDept = selectedDeptId?.toLowerCase().replace('dept-', '') || '';
                  return empDept === targetDept;
                });

                return (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <h3 className="text-xs font-black text-white">موظفو القسم المسندون</h3>
                      <Badge variant="outline" className="text-[10px] text-indigo-400">
                        {deptEmployees.length} موظف
                      </Badge>
                    </div>

                    {deptEmployees.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {deptEmployees.map((emp) => {
                          const statusColor =
                            emp.status === 'active'
                              ? 'b-success'
                              : emp.status === 'away'
                              ? 'b-warning'
                              : 'b-critical';

                          return (
                            <Card
                              key={emp.id}
                              onClick={() => navigate(`/owner/employees/${emp.id}`)}
                              className="p-5 cursor-pointer flex flex-col justify-between h-56 border border-slate-850 hover:border-indigo-500/30 transition-all duration-200"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 font-black flex items-center justify-center text-sm shadow-md">
                                    {emp.name[0]}
                                  </div>
                                  <div className="flex flex-col text-right">
                                    <h4 className="text-xs font-black text-white">{emp.name}</h4>
                                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">{emp.email}</span>
                                  </div>
                                </div>

                                <span className={`badge-v18 ${statusColor}`}>
                                  {emp.status === 'active' ? 'نشط' : emp.status === 'away' ? 'خارج العمل' : 'إجازة'}
                                </span>
                              </div>

                              {/* Capacity Workload */}
                              <div className="mt-4 space-y-1.5 text-right">
                                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                                  <span>نسبة الضغط والقدرة الاستيعابية</span>
                                  <span className="font-mono text-cyan-400">{emp.workloadScore}%</span>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-300"
                                    style={{ width: `${emp.workloadScore}%` }}
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800/60 text-[10px] text-slate-400 text-right">
                                <div className="flex flex-col gap-0.5">
                                  <span>المسمى:</span>
                                  <span className="font-bold text-white truncate">{emp.role === 'trainer' ? 'مدرب / كوتش' : 'موظف تشغيلي'}</span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <span>المهام النشطة:</span>
                                  <span className="font-bold text-white truncate">{emp.activeTasksCount || 0} مهام</span>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-16 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-dashed border-slate-850">
                        لا يوجد موظفون مسندون لهذا القسم حالياً.
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-2xl">
              لا توجد عناصر مضافة في تبويب {innerTabs.find((t) => t.id === activeTab)?.label} حالياً.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
export default DepartmentOSPage;
