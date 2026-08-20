import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Save, CheckCircle2 } from 'lucide-react';

interface PermissionRow {
  module: string;
  moduleLabel: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  scope: 'all' | 'dept' | 'own' | 'assigned' | 'custom';
}

export function PermissionMatrix() {
  const roles = [
    { id: 'owner', label: 'المالك - Owner' },
    { id: 'admin', label: 'المدير العام - Admin' },
    { id: 'manager', label: 'مدير القسم - Manager' },
    { id: 'employee', label: 'الموظف - Employee' },
    { id: 'trainer', label: 'المدرب - Trainer' },
    { id: 'customer', label: 'العميل - Customer' }
  ];

  const [activeRole, setActiveRole] = React.useState('manager');
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  // Seed default permission matrices for roles
  const [matrices, setMatrices] = React.useState<Record<string, PermissionRow[]>>({
    owner: [
      { module: 'organization', moduleLabel: 'إعدادات المؤسسة', view: true, create: true, edit: true, delete: true, scope: 'all' },
      { module: 'users', moduleLabel: 'إدارة المستخدمين', view: true, create: true, edit: true, delete: true, scope: 'all' },
      { module: 'departments', moduleLabel: 'الأقسام والتشغيل', view: true, create: true, edit: true, delete: true, scope: 'all' },
      { module: 'customers', moduleLabel: 'ملفات العملاء', view: true, create: true, edit: true, delete: true, scope: 'all' },
      { module: 'tasks', moduleLabel: 'المهام والتنفيذ', view: true, create: true, edit: true, delete: true, scope: 'all' },
      { module: 'ai', moduleLabel: 'الذكاء الاصطناعي والوكلاء', view: true, create: true, edit: true, delete: true, scope: 'all' },
      { module: 'finance', moduleLabel: 'المالية والميزانيات', view: true, create: true, edit: true, delete: true, scope: 'all' }
    ],
    manager: [
      { module: 'organization', moduleLabel: 'إعدادات المؤسسة', view: true, create: false, edit: false, delete: false, scope: 'dept' },
      { module: 'users', moduleLabel: 'إدارة المستخدمين', view: true, create: true, edit: true, delete: false, scope: 'dept' },
      { module: 'departments', moduleLabel: 'الأقسام والتشغيل', view: true, create: false, edit: true, delete: false, scope: 'dept' },
      { module: 'customers', moduleLabel: 'ملفات العملاء', view: true, create: true, edit: true, delete: false, scope: 'dept' },
      { module: 'tasks', moduleLabel: 'المهام والتنفيذ', view: true, create: true, edit: true, delete: true, scope: 'dept' },
      { module: 'ai', moduleLabel: 'الذكاء الاصطناعي والوكلاء', view: true, create: false, edit: false, delete: false, scope: 'dept' },
      { module: 'finance', moduleLabel: 'المالية والميزانيات', view: true, create: false, edit: false, delete: false, scope: 'dept' }
    ],
    employee: [
      { module: 'organization', moduleLabel: 'إعدادات المؤسسة', view: false, create: false, edit: false, delete: false, scope: 'own' },
      { module: 'users', moduleLabel: 'إدارة المستخدمين', view: false, create: false, edit: false, delete: false, scope: 'own' },
      { module: 'departments', moduleLabel: 'الأقسام والتشغيل', view: true, create: false, edit: false, delete: false, scope: 'own' },
      { module: 'customers', moduleLabel: 'ملفات العملاء', view: true, create: false, edit: false, delete: false, scope: 'assigned' },
      { module: 'tasks', moduleLabel: 'المهام والتنفيذ', view: true, create: true, edit: true, delete: false, scope: 'assigned' },
      { module: 'ai', moduleLabel: 'الذكاء الاصطناعي والوكلاء', view: true, create: false, edit: false, delete: false, scope: 'own' },
      { module: 'finance', moduleLabel: 'المالية والميزانيات', view: false, create: false, edit: false, delete: false, scope: 'own' }
    ],
    customer: [
      { module: 'organization', moduleLabel: 'إعدادات المؤسسة', view: false, create: false, edit: false, delete: false, scope: 'own' },
      { module: 'users', moduleLabel: 'إدارة المستخدمين', view: false, create: false, edit: false, delete: false, scope: 'own' },
      { module: 'departments', moduleLabel: 'الأقسام والتشغيل', view: false, create: false, edit: false, delete: false, scope: 'own' },
      { module: 'customers', moduleLabel: 'ملفات العملاء', view: true, create: false, edit: true, delete: false, scope: 'own' },
      { module: 'tasks', moduleLabel: 'المهام والتنفيذ', view: true, create: false, edit: false, delete: false, scope: 'own' },
      { module: 'ai', moduleLabel: 'الذكاء الاصطناعي والوكلاء', view: true, create: false, edit: false, delete: false, scope: 'own' },
      { module: 'finance', moduleLabel: 'المالية والميزانيات', view: true, create: false, edit: false, delete: false, scope: 'own' }
    ]
  });

  const activeMatrix = matrices[activeRole] || matrices['employee'];

  const togglePermission = (index: number, field: 'view' | 'create' | 'edit' | 'delete') => {
    const updated = { ...matrices };
    const currentList = [...(updated[activeRole] || [])];
    if (currentList[index]) {
      currentList[index] = {
        ...currentList[index],
        [field]: !currentList[index][field]
      };
      updated[activeRole] = currentList;
      setMatrices(updated);
    }
  };

  const handleScopeChange = (index: number, scope: any) => {
    const updated = { ...matrices };
    const currentList = [...(updated[activeRole] || [])];
    if (currentList[index]) {
      currentList[index] = {
        ...currentList[index],
        scope
      };
      updated[activeRole] = currentList;
      setMatrices(updated);
    }
  };

  const saveMatrix = () => {
    setSuccessMsg('✅ تم حفظ مصفوفة الصلاحيات وتحديث مستويات النفاذ بنجاح!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <Card className="border border-slate-800/80 bg-slate-900/60 p-6 rounded-3xl relative overflow-hidden">
      {successMsg && (
        <div className="absolute top-4 left-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <CardHeader className="pb-4">
        <CardTitle className="text-base text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-400" />
          <span>محرر صلاحيات الأدوار — RBAC & Scope Editor</span>
        </CardTitle>
        <CardDescription>
          تخصيص الصلاحيات الدقيقة لكل دور (Role) وتحديد نطاق الرؤية والوصول الجغرافي والتشغيلي (Scope).
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Role Selector Tabs */}
        <div className="flex flex-wrap gap-2 p-1 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
          {roles.map((role) => {
            const isTabActive = activeRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => {
                  setActiveRole(role.id);
                  setSuccessMsg(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isTabActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {role.label}
              </button>
            );
          })}
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto border border-slate-800/60 rounded-2xl bg-slate-950/30">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-4">الكيان / القسم</th>
                <th className="p-4 text-center">عرض (View)</th>
                <th className="p-4 text-center">إنشاء (Create)</th>
                <th className="p-4 text-center">تعديل (Edit)</th>
                <th className="p-4 text-center">حذف (Delete)</th>
                <th className="p-4">نطاق الوصول (Scope)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {activeMatrix.map((row, idx) => (
                <tr key={row.module} className="hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 font-extrabold text-slate-100">{row.moduleLabel}</td>
                  
                  {/* View checkbox */}
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={row.view}
                      onChange={() => togglePermission(idx, 'view')}
                      className="w-4 h-4 accent-indigo-500 rounded border-slate-800 cursor-pointer"
                    />
                  </td>

                  {/* Create checkbox */}
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={row.create}
                      onChange={() => togglePermission(idx, 'create')}
                      className="w-4 h-4 accent-indigo-500 rounded border-slate-800 cursor-pointer"
                    />
                  </td>

                  {/* Edit checkbox */}
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={row.edit}
                      onChange={() => togglePermission(idx, 'edit')}
                      className="w-4 h-4 accent-indigo-500 rounded border-slate-800 cursor-pointer"
                    />
                  </td>

                  {/* Delete checkbox */}
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={row.delete}
                      onChange={() => togglePermission(idx, 'delete')}
                      className="w-4 h-4 accent-indigo-500 rounded border-slate-800 cursor-pointer"
                    />
                  </td>

                  {/* Scope Select dropdown */}
                  <td className="p-4">
                    <select
                      value={row.scope}
                      onChange={(e) => handleScopeChange(idx, e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-[11px] rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="all">كل المؤسسة (All Organization)</option>
                      <option value="dept">القسم التابع له (Department)</option>
                      <option value="own">البيانات الخاصة فقط (Own)</option>
                      <option value="assigned">الكيانات المعينة له (Assigned)</option>
                      <option value="custom">مخصص (Custom Rules)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Matrix Footer Action */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
          <Badge variant="outline" className="border-indigo-500/20 text-indigo-400 bg-indigo-500/5 text-[10px]">
            💡 التعديل هنا يغير صلاحيات الوصول للذكاء الاصطناعي والوكلاء تلقائياً.
          </Badge>
          <Button onClick={saveMatrix} size="sm" className="gap-2">
            <Save className="w-4 h-4" />
            <span>حفظ مصفوفة الصلاحيات</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
