import React from 'react';
import * as Icons from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { settingsService } from '../services/settings.service';
import { settingsCategories } from '../mocks/settings.mock';
import { SettingItem, UserItem, DepartmentItem, AuditLogItem } from '../types/settings.types';
import { PermissionMatrix } from '../components/PermissionMatrix';
import { BrandingPreview } from '../components/BrandingPreview';
import { AutomationBuilder } from '../components/AutomationBuilder';
import { ChangePreviewModal } from '../components/ChangePreviewModal';
import { InviteSettingsPanel } from '../components/InviteSettingsPanel';
import { JourneyStagesEditor } from '../components/JourneyStagesEditor';
import { TaskTemplatesBuilder } from '../components/TaskTemplatesBuilder';
import { SlaManager } from '../components/SlaManager';
import { NotificationsCenter } from '../components/NotificationsCenter';
import { AlertRuleBuilder } from '../components/AlertRuleBuilder';
import { ApprovalFlowsConfig } from '../components/ApprovalFlowsConfig';
import { AiAgentsManager } from '../components/AiAgentsManager';
import { PerformanceWeightEditor } from '../components/PerformanceWeightEditor';
import { AiCostControlsPanel } from '../components/AiCostControlsPanel';
import { KpiTargetConfigurator } from '../components/KpiTargetConfigurator';
import { VersionHistoryPanel } from '../components/VersionHistoryPanel';
import { CmsSettingsPanel } from '../components/CmsSettingsPanel';
import { KnowledgeBaseSettings } from '../components/KnowledgeBaseSettings';
import { CollaborationSettingsPanel } from '../components/CollaborationSettingsPanel';
import { SecuritySettingsPanel } from '../components/SecuritySettingsPanel';
import { PrivacySettingsPanel } from '../components/PrivacySettingsPanel';
import { FilesStorageSettings } from '../components/FilesStorageSettings';
import { ApiWebhooksPanel } from '../components/ApiWebhooksPanel';
import { FeatureFlagsPanel } from '../components/FeatureFlagsPanel';
import { TaskPerformanceManager } from '../components/TaskPerformanceManager';
import { ExecutiveReportsPanel } from '../components/ExecutiveReportsPanel';



import { useDialogStore } from '@/stores/dialog.store';

export function SettingsPage() {
  const { showAlert } = useDialogStore();
  const [settings, setSettings] = React.useState<SettingItem[]>([]);
  const [users, setUsers] = React.useState<UserItem[]>([]);
  const [departments, setDepartments] = React.useState<DepartmentItem[]>([]);
  const [auditLogs, setAuditLogs] = React.useState<AuditLogItem[]>([]);

  // Selection states
  const [activeCategory, setActiveCategory] = React.useState('general');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Unsaved changes state
  const [dirtyChanges, setDirtyChanges] = React.useState<Record<string, any>>({});
  const [showPreviewModal, setShowPreviewModal] = React.useState(false);

  // Danger zone confirmation
  const [dangerConfirmText, setDangerConfirmText] = React.useState('');
  const [isDangerActionLoading, setIsDangerActionLoading] = React.useState(false);
  const [dangerSuccess, setDangerSuccess] = React.useState<string | null>(null);

  // Success banner
  const [successBanner, setSuccessBanner] = React.useState<string | null>(null);

  // Branding states to pass down
  const [primaryColor, setPrimaryColor] = React.useState('#6366f1');
  const [secondaryColor, setSecondaryColor] = React.useState('#06b6d4');
  const [accentColor, setAccentColor] = React.useState('#8b5cf6');
  const [successColor, setSuccessColor] = React.useState('#10b981');
  const [dangerColor, setDangerColor] = React.useState('#ef4444');
  const [borderRadius, setBorderRadius] = React.useState('20px');

  React.useEffect(() => {
    setSettings(settingsService.getSettings());
    setUsers(settingsService.getUsers());
    setDepartments(settingsService.getDepartments());
    setAuditLogs(settingsService.getAuditLogs());
  }, []);

  // Update dirty changes state
  const handleSettingChange = (id: string, val: any) => {
    setDirtyChanges((prev) => ({
      ...prev,
      [id]: val,
    }));
  };

  const handleDiscard = () => {
    setDirtyChanges({});
  };

  const handleConfirmSave = async () => {
    setShowPreviewModal(false);
    const result = await settingsService.saveSettings(dirtyChanges);
    if (result.success) {
      // Apply locally
      const updated = settings.map((s) => {
        if (dirtyChanges[s.id] !== undefined) {
          return { ...s, value: dirtyChanges[s.id] };
        }
        return s;
      });
      setSettings(updated);
      setDirtyChanges({});
      setAuditLogs(settingsService.getAuditLogs());
      setSuccessBanner('✅ تم تطبيق جميع التغييرات بنجاح وتوثيق العملية بسجلات التدقيق!');
      setTimeout(() => setSuccessBanner(null), 3000);
    }
  };

  // Search logic: matches setting name, description, group, keywords, category
  const filteredSettings = settings.filter((s) => {
    if (!searchQuery) return s.category === activeCategory;
    const query = searchQuery.toLowerCase();
    const matchesTitle = s.title.toLowerCase().includes(query);
    const matchesDesc = s.description.toLowerCase().includes(query);
    const matchesGroup = s.group.toLowerCase().includes(query);
    const matchesKeywords = s.keywords?.some((k) => k.toLowerCase().includes(query)) || false;
    return matchesTitle || matchesDesc || matchesGroup || matchesKeywords;
  });

  // Unique groups in search results
  const resultGroups = Array.from(new Set(filteredSettings.map((s) => s.group)));

  // Danger zone executions
  const handleDangerZoneAction = (actionName: string) => {
    if (dangerConfirmText !== 'DELETE') {
      showAlert('تأكيد الإجراء الحساس', 'الرجاء كتابة كلمة DELETE بدقة لتأكيد الإجراء الحساس!');
      return;
    }
    setIsDangerActionLoading(true);
    setTimeout(() => {
      setDangerSuccess(`✅ تم بنجاح تنفيذ إجراء: "${actionName}" وتم تسجيل العملية في ملف تدقيق الطوارئ!`);
      setDangerConfirmText('');
      setIsDangerActionLoading(false);
      setTimeout(() => setDangerSuccess(null), 4000);
    }, 1200);
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.Settings;
    return <IconComponent className="w-4.5 h-4.5" />;
  };

  return (
    <div className="flex flex-col gap-6 p-1 pb-24 relative select-none">
      {/* Top Banner Success Notification */}
      {successBanner && (
        <div className="fixed top-4 left-4 right-4 md:left-1/3 md:right-1/3 bg-emerald-600 text-white p-3 rounded-2xl z-50 text-xs font-black text-center shadow-2xl border border-emerald-500 flex items-center justify-center gap-1.5 animate-in fade-in slide-in-from-top-4">
          <Icons.CheckCircle2 className="w-4.5 h-4.5 text-white" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[24px] bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col gap-1 z-10">
          <Badge variant="default" className="w-fit bg-gradient-to-r from-indigo-600 to-cyan-500 text-white">
            <Icons.Sliders className="w-3.5 h-3.5 me-1.5" />
            مركز التحكم وإعدادات النظام — Vision OS Settings
          </Badge>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1.5">
            لوحة الإعدادات وتخصيص بيئة التشغيل
          </h1>
          <p className="text-xs text-slate-400">
            تخصيص الهوية البصرية، أوزان تقييم الموظفين، أتمتة الإجراءات وصلاحيات الأمان لأكاديمية المستبصرين.
          </p>
        </div>

        {/* Global Settings Search */}
        <div className="w-full md:w-80 z-10">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث في اسم أو وصف الإعداد..."
            icon={<Icons.Search className="w-4 h-4 text-slate-400" />}
            className="bg-slate-950/80 border-slate-800/80 text-white placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Main Panel Content with Inner Category Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Right Sidebar: 50 Settings Categories */}
        <div className="w-full lg:w-72 shrink-0 bg-[#0b0e1a]/95 border border-slate-800 rounded-3xl p-3 max-h-[calc(100vh-190px)] overflow-y-auto no-scrollbar space-y-1">
          <div className="px-3 py-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest border-b border-slate-800/80 mb-2">
            جميع أقسام الإعدادات (50)
          </div>
          {settingsCategories.map((cat) => {
            const isCatActive = searchQuery ? false : activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSearchQuery('');
                }}
                className={`w-full text-right flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isCatActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isCatActive ? 'text-white' : 'text-indigo-400'}>
                    {renderIcon(cat.icon)}
                  </span>
                  <span>{cat.title}</span>
                </div>
                {isCatActive && <Icons.ChevronLeft className="w-4 h-4 text-white" />}
              </button>
            );
          })}
        </div>

        {/* Left Side: Active Settings Workspace */}
        <div className="flex-1 w-full space-y-6">
          {/* SEARCH RESULTS VIEW */}
          {searchQuery && (
            <div className="space-y-6">
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <Icons.Search className="w-4 h-4 text-cyan-400" />
                <span>نتائج البحث عن: "{searchQuery}" ({filteredSettings.length} إعداد)</span>
              </h2>

              {filteredSettings.length > 0 ? (
                resultGroups.map((group) => (
                  <Card key={group} className="p-6">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs text-indigo-400 font-extrabold uppercase">
                        {group}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {filteredSettings
                        .filter((s) => s.group === group)
                        .map((setting) => (
                          <div key={setting.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-3 border-b border-slate-800/60 last:border-0 last:pb-0 text-xs">
                            <div>
                              <div className="font-extrabold text-white">{setting.title}</div>
                              <div className="text-[11px] text-slate-400 mt-1">{setting.description}</div>
                            </div>
                            <div>{renderSettingInput(setting)}</div>
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-3xl text-slate-500 text-xs">
                  لا توجد نتائج تطابق بحثك. يرجى تجربة كلمات مفتاحية أخرى.
                </div>
              )}
            </div>
          )}

          {/* DYNAMIC CATEGORY VIEWS (when search is empty) */}
          {!searchQuery && (
            <>
              {/* BRANDING PREVIEW PANEL */}
              {activeCategory === 'branding' && (
                <BrandingPreview
                  primaryColor={primaryColor}
                  setPrimaryColor={setPrimaryColor}
                  secondaryColor={secondaryColor}
                  setSecondaryColor={setSecondaryColor}
                  accentColor={accentColor}
                  setAccentColor={setAccentColor}
                  successColor={successColor}
                  setSuccessColor={setSuccessColor}
                  dangerColor={dangerColor}
                  setDangerColor={setDangerColor}
                  borderRadius={borderRadius}
                  setBorderRadius={setBorderRadius}
                />
              )}

              {/* ROLES & PERMISSIONS PANEL */}
              {activeCategory === 'roles-permissions' && <PermissionMatrix />}

              {/* AUTOMATION BUILDER PANEL */}
              {activeCategory === 'automation' && <AutomationBuilder />}

              {/* USERS TABLE PANEL */}
              {activeCategory === 'users' && (
                <Card className="border border-slate-800 bg-slate-900/60 p-6 rounded-3xl">
                  <CardHeader className="pb-4 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base text-white flex items-center gap-2">
                        <Icons.Users className="w-5 h-5 text-indigo-400" />
                        <span>إدارة حسابات المستخدمين والموظفين — User Accounts</span>
                      </CardTitle>
                      <CardDescription>
                        استعراض وتعديل أدوار الموظفين، إعادة تعيين كلمات المرور وإلغاء صلاحية الجلسات.
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="overflow-x-auto border border-slate-800/80 rounded-2xl bg-slate-950/40">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">الاسم / المستخدم</th>
                          <th className="p-3.5">البريد الإلكتروني</th>
                          <th className="p-3.5">الدور (Role)</th>
                          <th className="p-3.5">القسم</th>
                          <th className="p-3.5">حالة الاتصال</th>
                          <th className="p-3.5">آخر ظهور</th>
                          <th className="p-3.5 text-center">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-200">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-800/20 transition-colors">
                            <td className="p-3.5 font-bold text-white">{user.name}</td>
                            <td className="p-3.5 text-slate-400">{user.email}</td>
                            <td className="p-3.5">
                              <Badge variant="outline" className="border-indigo-500/20 text-indigo-400 bg-indigo-500/5">
                                {user.role}
                              </Badge>
                            </td>
                            <td className="p-3.5 text-indigo-300 font-bold">{user.department}</td>
                            <td className="p-3.5">
                              <span className={`w-2 h-2 rounded-full inline-block me-1.5 ${user.status === 'active' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                              <span>{user.status === 'active' ? 'نشط' : 'معطل'}</span>
                            </td>
                            <td className="p-3.5 text-slate-400 font-mono">{user.lastLogin}</td>
                            <td className="p-3.5 text-center flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  settingsService.updateUser(user.id, { status: user.status === 'active' ? 'inactive' : 'active' });
                                  setUsers([...settingsService.getUsers()]);
                                }}
                                className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
                              >
                                {user.status === 'active' ? 'تعطيل الحساب' : 'تفعيل'}
                              </button>
                              <button
                                onClick={() => showAlert('إعادة تعيين كلمة المرور', `🔑 تم توليد كلمة مرور مؤقتة للمستخدم ${user.name} وإرسالها لبريده بنجاح!`)}
                                className="px-2 py-1 rounded bg-indigo-600 text-white hover:opacity-90 cursor-pointer"
                              >
                                إعادة تعيين
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              )}

              {/* AUDIT LOG VIEWER PANEL */}
              {activeCategory === 'audit-logs-setting' && (
                <Card className="border border-slate-800 bg-slate-900/60 p-6 rounded-3xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base text-white flex items-center gap-2">
                      <Icons.Shield className="w-5 h-5 text-emerald-400" />
                      <span>سجل تدقيق الأمان والمراقبة — Unified Audit Logs</span>
                    </CardTitle>
                    <CardDescription>
                      تسجيل تاريخي كامل وغير قابل للمسح لكافة العمليات الحساسة وتعديلات الإعدادات.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-x-auto border border-slate-800/80 rounded-2xl bg-slate-950/40">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">المنفّذ (Actor)</th>
                          <th className="p-3.5">العملية (Action)</th>
                          <th className="p-3.5">القسم الموارد</th>
                          <th className="p-3.5 text-center">التفاصيل</th>
                          <th className="p-3.5">التوقيت والتاريخ</th>
                          <th className="p-3.5">الجهاز والعنوان IP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-200">
                        {auditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                            <td className="p-3.5 font-bold text-white">{log.actor}</td>
                            <td className="p-3.5 text-indigo-300 font-extrabold">{log.action}</td>
                            <td className="p-3.5 text-slate-400">{log.resource}</td>
                            <td className="p-3.5 text-center font-mono text-[11px] text-emerald-400">{log.after}</td>
                            <td className="p-3.5 text-slate-400 font-mono">{log.timestamp}</td>
                            <td className="p-3.5 text-[10px] text-slate-500 font-mono">{log.ip} — {log.device}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              )}

              {/* DEPARTMENTS PANEL */}
              {activeCategory === 'departments' && (
                <div className="space-y-6">
                  <Card className="border border-slate-800 bg-slate-900/60 p-6 rounded-3xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base text-white flex items-center gap-2">
                        <Icons.Briefcase className="w-5 h-5 text-indigo-400" />
                        <span>إدارة أقسام العمل التشغيلية — Departments OS</span>
                      </CardTitle>
                      <CardDescription>
                        إضافة وتحديث الأقسام، تعيين المدراء التنفيذيين وإسناد المهام.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {departments.map((d) => (
                          <div key={d.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col gap-2 text-xs relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-1.5 bottom-0" style={{ backgroundColor: d.color }} />
                            <div className="flex items-center justify-between pl-2">
                              <span className="font-extrabold text-white text-sm">{d.name}</span>
                              <Badge variant="outline" className="text-[10px] border-slate-800 text-slate-400">
                                {d.membersCount} موظفاً
                              </Badge>
                            </div>
                            <p className="text-slate-400 text-[11px] leading-relaxed pl-2">{d.description}</p>
                            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] pl-2 text-slate-500">
                              <span>المدير المسؤول: <strong className="text-indigo-400">{d.manager}</strong></span>
                              <button onClick={() => showAlert('تهيئة القسم والـ KPIs', `⚙️ تم البدء في تهيئة إعدادات المبيعات والـ KPIs للقسم ${d.name} بنجاح!`)} className="text-[#00a884] hover:underline font-bold">
                                تعديل القواعد
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* DANGER ZONE PANEL */}
              {activeCategory === 'danger-zone' && (
                <Card className="border border-red-500/20 bg-red-950/5 p-6 rounded-3xl">
                  {dangerSuccess && (
                    <div className="p-3 mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                      <Icons.CheckCircle2 className="w-4.5 h-4.5" />
                      <span>{dangerSuccess}</span>
                    </div>
                  )}

                  <CardHeader className="pb-4">
                    <CardTitle className="text-base text-red-500 flex items-center gap-2">
                      <Icons.Skull className="w-5 h-5" />
                      <span>منطقة الخطر والعمليات الحساسة — Danger Zone</span>
                    </CardTitle>
                    <CardDescription className="text-red-400/75">
                      تنبيه هام! الإجراءات هنا تسبب مسح دائم لقواعد البيانات أو إلغاء تفعيل المؤسسة ولا يمكن التراجع عنها.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 text-xs text-right">
                    <div className="p-4 rounded-2xl bg-red-950/10 border border-red-500/20 space-y-4">
                      <label className="block text-slate-300 font-bold">
                        أدخل الكلمة التأكيدية <strong className="text-red-400">DELETE</strong> لتفعيل الأزرار أدناه:
                      </label>
                      <input
                        type="text"
                        value={dangerConfirmText}
                        onChange={(e) => setDangerConfirmText(e.target.value)}
                        placeholder="اكتب الكلمة التأكيدية..."
                        className="w-full max-w-xs bg-slate-950 border border-red-500/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-mono text-center tracking-widest"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-red-500/10 bg-slate-950/20 flex flex-col justify-between gap-3">
                        <div>
                          <h4 className="font-extrabold text-white">إعادة ضبط جميع الإعدادات الافتراضية</h4>
                          <p className="text-[10px] text-slate-500 mt-1">
                            إرجاع جميع أوزان الأداء والهوية البصرية للحالة المبدئية عند تنصيب النظام.
                          </p>
                        </div>
                        <Button
                          onClick={() => handleDangerZoneAction('إعادة ضبط الإعدادات')}
                          disabled={dangerConfirmText !== 'DELETE' || isDangerActionLoading}
                          className="bg-red-900/60 hover:bg-red-800 text-white border border-red-500/20 h-9"
                        >
                          مسح وإعادة ضبط
                        </Button>
                      </div>

                      <div className="p-4 rounded-xl border border-red-500/10 bg-slate-950/20 flex flex-col justify-between gap-3">
                        <div>
                          <h4 className="font-extrabold text-white">أرشفة وإيقاف ملف المؤسسة بالكامل</h4>
                          <p className="text-[10px] text-slate-500 mt-1">
                            سيفقد جميع الموظفين والعملاء صلاحية تسجيل الدخول وحساباتهم فوراً.
                          </p>
                        </div>
                        <Button
                          onClick={() => handleDangerZoneAction('أرشفة المؤسسة')}
                          disabled={dangerConfirmText !== 'DELETE' || isDangerActionLoading}
                          className="bg-red-950 hover:bg-red-900 text-white border border-red-500/40 h-9"
                        >
                          أرشفة المنظمة
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* INTEGRATIONS MARKETPLACE */}
              {activeCategory === 'integrations' && (
                <div className="space-y-6">
                  <Card className="border border-slate-800 bg-slate-900/60 p-6 rounded-3xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base text-white flex items-center gap-2">
                        <Icons.Grid className="w-5 h-5 text-indigo-400" />
                        <span>سوق التكاملات والربط البرمجي — Integrations Marketplace</span>
                      </CardTitle>
                      <CardDescription>
                        ربط ومزامنة منصات التواصل والتخزين السحابي والتقويم الخارجي مع بيئة التشغيل.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {[
                        { name: 'Google Calendar', desc: 'مزامنة مواعيد الموظفين والعملاء تلقائياً', status: 'connected', color: 'text-indigo-400', icon: 'Calendar' },
                        { name: 'WhatsApp Business API', desc: 'إرسال الإشعارات والتنبيهات المباشرة', status: 'connected', color: 'text-[#00a884]', icon: 'MessageCircle' },
                        { name: 'Google Drive Storage', desc: 'تخزين عقود وملفات العملاء بشكل سحابي', status: 'disconnected', color: 'text-amber-400', icon: 'HardDrive' },
                        { name: 'Facebook Ads Pixel', desc: 'تتبع حملات التسويق ومعدل التحويل للعملاء', status: 'disconnected', color: 'text-blue-500', icon: 'Facebook' }
                      ].map((integ, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4 text-xs">
                          <div className="flex items-center gap-3">
                            <span className={`p-2.5 rounded-xl bg-slate-900 border border-slate-800 ${integ.color}`}>
                              {renderIcon(integ.icon)}
                            </span>
                            <div>
                              <h4 className="font-extrabold text-white">{integ.name}</h4>
                              <p className="text-[10px] text-slate-500 mt-0.5">{integ.desc}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${integ.status === 'connected' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                              {integ.status === 'connected' ? '● متصل' : 'غير متصل'}
                            </span>
                            <button
                              type="button"
                              onClick={() => showAlert('ربط التكامل الخارجي', `🔌 تم تغيير حالة الاتصال وتعديل إعدادات التزامن لـ ${integ.name} بنجاح!`)}
                              className="text-[10px] font-bold text-indigo-400 hover:underline cursor-pointer"
                            >
                              {integ.status === 'connected' ? 'قطع الاتصال' : 'ربط الحساب'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* DEVELOPER SETTINGS & HEALTH CHECK */}
              {activeCategory === 'developer-settings' && (
                <div className="space-y-6">
                  <Card className="border border-slate-800 bg-slate-900/60 p-6 rounded-3xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base text-white flex items-center gap-2">
                        <Icons.Terminal className="w-5 h-5 text-emerald-400" />
                        <span>حالة صحة النظام والمطور — Developer & System Health</span>
                      </CardTitle>
                      <CardDescription>
                        فحص الاتصال بقواعد البيانات وقوائم الانتظار وموديلات الـ AI والخدمات السحابية.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 mt-2">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { service: 'سيرفر التطبيق API', status: 'Healthy', color: 'text-emerald-400 bg-emerald-500/10' },
                          { service: 'قاعدة البيانات DB', status: 'Healthy', color: 'text-emerald-400 bg-emerald-500/10' },
                          { service: 'تخزين الملفات S3', status: 'Healthy', color: 'text-emerald-400 bg-emerald-500/10' },
                          { service: 'محرك الـ AI', status: 'Warning', color: 'text-amber-400 bg-amber-500/10' },
                          { service: 'قوائم المهام Queue', status: 'Healthy', color: 'text-emerald-400 bg-emerald-500/10' },
                          { service: 'الربط بالبريد SMTP', status: 'Healthy', color: 'text-emerald-400 bg-emerald-500/10' },
                          { service: 'الربط بالواتساب API', status: 'Healthy', color: 'text-emerald-400 bg-emerald-500/10' },
                          { service: 'الويب هوكس Webhooks', status: 'Healthy', color: 'text-emerald-400 bg-emerald-500/10' }
                        ].map((srv, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                            <span className="font-extrabold text-slate-300">{srv.service}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${srv.color}`}>
                              {srv.status === 'Healthy' ? 'سليم' : 'تأخير بسيط'}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          <Icons.Activity className="w-5 h-5 text-indigo-400" />
                          <div>
                            <span className="font-extrabold text-white block">مراقبة استهلاك الموارد</span>
                            <span className="text-[10px] text-slate-500">زمن الاستجابة الحالي: 140ms — استهلاك الذاكرة: 12%</span>
                          </div>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={() => showAlert('فحص الاتصال الفوري', '🔄 تم عمل اختبار Ping لكافة السيرفرات بنجاح!')}>
                          فحص الاتصال الفوري (Ping)
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* INVITE SETTINGS PANEL */}
              {activeCategory === 'invite-settings' && <InviteSettingsPanel />}

              {/* JOURNEY STAGES EDITOR */}
              {activeCategory === 'journey-stages' && <JourneyStagesEditor />}

              {/* TASK TEMPLATES BUILDER */}
              {activeCategory === 'tasks-templates' && <TaskTemplatesBuilder />}

              {/* SLA MANAGER */}
              {activeCategory === 'sla' && <SlaManager />}

              {/* NOTIFICATIONS CENTER */}
              {activeCategory === 'notifications' && <NotificationsCenter />}

              {/* ALERT RULE BUILDER */}
              {activeCategory === 'alerts' && <AlertRuleBuilder />}

              {/* APPROVAL FLOWS CONFIG */}
              {activeCategory === 'approvals' && <ApprovalFlowsConfig />}

              {/* AI AGENTS MANAGER */}
              {activeCategory === 'ai-agents' && (
                <div className="space-y-6 text-right">
                  {!settings.find((s) => s.id === 'enable_ai')?.value && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs rounded-2xl flex items-center gap-2">
                      <Icons.AlertTriangle className="w-5 h-5" />
                      <span>تم تعطيل محرك الذكاء الاصطناعي العام. يرجى تفعيل إعداد (Enable AI) في تبويب إعدادات الذكاء الاصطناعي لتمكين التعديل هنا.</span>
                    </div>
                  )}
                  <div className={!settings.find((s) => s.id === 'enable_ai')?.value ? 'opacity-40 pointer-events-none' : ''}>
                    <AiAgentsManager />
                  </div>
                </div>
              )}

              {/* PERFORMANCE WEIGHT EDITOR */}
              {activeCategory === 'performance-scoring' && <PerformanceWeightEditor />}

              {/* KPI TARGET CONFIGURATOR */}
              {activeCategory === 'performance-analytics' && <KpiTargetConfigurator />}

              {/* AI COST CONTROLS */}
              {activeCategory === 'ai-tools' && (
                <div className="space-y-6 text-right">
                  {!settings.find((s) => s.id === 'enable_ai')?.value && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs rounded-2xl flex items-center gap-2">
                      <Icons.AlertTriangle className="w-5 h-5" />
                      <span>تم تعطيل محرك الذكاء الاصطناعي العام. يرجى تفعيل إعداد (Enable AI) في تبويب إعدادات الذكاء الاصطناعي لتمكين التعديل هنا.</span>
                    </div>
                  )}
                  <div className={!settings.find((s) => s.id === 'enable_ai')?.value ? 'opacity-40 pointer-events-none' : ''}>
                    <AiCostControlsPanel />
                  </div>
                </div>
              )}

              {/* VERSION HISTORY */}
              {activeCategory === 'backup-data' && (
                <div className="space-y-6">
                  <VersionHistoryPanel />
                </div>
              )}

              {/* CMS SETTINGS PANEL */}
              {activeCategory === 'cms' && <CmsSettingsPanel />}

              {/* KNOWLEDGE BASE SETTINGS */}
              {activeCategory === 'knowledge' && <KnowledgeBaseSettings />}

              {/* COLLABORATION SETTINGS */}
              {activeCategory === 'collaboration' && <CollaborationSettingsPanel />}

              {/* SECURITY SETTINGS */}
              {activeCategory === 'security' && <SecuritySettingsPanel />}

              {/* PRIVACY SETTINGS */}
              {activeCategory === 'privacy' && <PrivacySettingsPanel />}

              {/* FILES & STORAGE SETTINGS */}
              {activeCategory === 'files-storage' && <FilesStorageSettings />}

              {/* API & WEBHOOKS SETTINGS */}
              {activeCategory === 'api-settings' && <ApiWebhooksPanel />}

              {/* FEATURE FLAGS SETTINGS */}
              {activeCategory === 'feature-flags' && <FeatureFlagsPanel />}

              {/* TASK PERFORMANCE SETTINGS */}
              {activeCategory === 'task-performance' && <TaskPerformanceManager />}

              {/* EXECUTIVE REPORTS SETTINGS */}
              {activeCategory === 'executive-reports' && <ExecutiveReportsPanel />}

              {/* DYNAMIC METADATA REGISTER FORM (For General, AI, etc.) */}
              {activeCategory !== 'branding' &&
                activeCategory !== 'roles-permissions' &&
                activeCategory !== 'automation' &&
                activeCategory !== 'users' &&
                activeCategory !== 'audit-logs-setting' &&
                activeCategory !== 'departments' &&
                activeCategory !== 'danger-zone' &&
                activeCategory !== 'integrations' &&
                activeCategory !== 'developer-settings' &&
                activeCategory !== 'invite-settings' &&
                activeCategory !== 'journey-stages' &&
                activeCategory !== 'tasks-templates' &&
                activeCategory !== 'sla' &&
                activeCategory !== 'notifications' &&
                activeCategory !== 'alerts' &&
                activeCategory !== 'approvals' &&
                activeCategory !== 'ai-agents' &&
                activeCategory !== 'performance-scoring' &&
                activeCategory !== 'performance-analytics' &&
                activeCategory !== 'ai-tools' &&
                activeCategory !== 'backup-data' &&
                activeCategory !== 'cms' &&
                activeCategory !== 'knowledge' &&
                activeCategory !== 'collaboration' &&
                activeCategory !== 'security' &&
                activeCategory !== 'privacy' &&
                activeCategory !== 'files-storage' &&
                activeCategory !== 'api-settings' &&
                activeCategory !== 'feature-flags' &&
                activeCategory !== 'task-performance' &&
                activeCategory !== 'executive-reports' && (
                  <div className="space-y-6">
                    {/* Filter categories */}
                    {Array.from(new Set(settings.filter((s) => s.category === activeCategory).map((s) => s.group))).map(
                      (group) => (
                        <Card key={group} className="p-6">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-xs text-indigo-400 font-extrabold uppercase">
                              {group}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4 mt-2">
                            {settings
                              .filter((s) => s.category === activeCategory && s.group === group)
                              .map((setting) => (
                                <div key={setting.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-3.5 border-b border-slate-800/60 last:border-0 last:pb-0 text-xs">
                                  <div className="max-w-xl">
                                    <div className="font-extrabold text-white">{setting.title}</div>
                                    <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">{setting.description}</div>
                                  </div>
                                  <div>{renderSettingInput(setting)}</div>
                                </div>
                              ))}
                          </CardContent>
                        </Card>
                      )
                    )}
                  </div>
                )}
            </>
          )}
        </div>
      </div>

      {/* Sticky Save Bar */}
      {Object.keys(dirtyChanges).length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-2xl z-40 animate-in slide-in-from-bottom-6">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs text-slate-200">
              تنبيه: لديك تعديلات لم يتم حفظها ({Object.keys(dirtyChanges).length} تغييرات معلقة)
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Button variant="ghost" size="sm" onClick={handleDiscard} className="h-8 text-xs">
              تراجع وإلغاء
            </Button>
            <Button size="sm" onClick={() => setShowPreviewModal(true)} className="h-8 text-xs bg-indigo-600 hover:bg-indigo-500">
              مراجعة وحفظ التغييرات
            </Button>
          </div>
        </div>
      )}

      {/* Preview Confirmation Modal */}
      <ChangePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onConfirm={handleConfirmSave}
        changes={dirtyChanges}
        originalSettings={settings}
      />
    </div>
  );

  // Helper input renderer depending on setting metadata type
  function renderSettingInput(item: SettingItem) {
    const value = dirtyChanges[item.id] !== undefined ? dirtyChanges[item.id] : item.value;

    switch (item.type) {
      case 'boolean':
        return (
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => handleSettingChange(item.id, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-950 border border-slate-800 rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:right-[4px] after:bg-slate-400 peer-checked:after:bg-[#00a884] after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#00a884]/15 peer-checked:border-[#00a884]/40" />
          </label>
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleSettingChange(item.id, e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer min-w-44"
          >
            {item.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleSettingChange(item.id, parseFloat(e.target.value))}
            className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-center"
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleSettingChange(item.id, e.target.value)}
            className="w-80 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
            rows={2}
          />
        );

      case 'text':
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleSettingChange(item.id, e.target.value)}
            className="w-64 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        );
    }
  }
}
export default SettingsPage;
