import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ApprovalRule } from '../types/settings.types';
import { settingsService } from '../services/settings.service';

export function ApprovalFlowsConfig() {
  const [rules, setRules] = React.useState<ApprovalRule[]>([]);
  const [selectedRule, setSelectedRule] = React.useState<ApprovalRule | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    const data = settingsService.getApprovalRules();
    setRules(data);
    if (data.length > 0) {
      setSelectedRule(data[0]);
    }
  }, []);

  const handleUpdateField = (key: keyof ApprovalRule, val: any) => {
    if (!selectedRule) return;
    const updated = { ...selectedRule, [key]: val };
    setSelectedRule(updated);
    settingsService.updateApprovalRule(selectedRule.id, { [key]: val });
    setRules(rules.map((r) => (r.id === selectedRule.id ? updated : r)));
  };

  const handleSave = () => {
    setSuccess('✅ تم تحديث سلاسل الاعتماد والموافقة بنجاح!');
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 text-right">
      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4.5 h-4.5" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules Selection */}
        <Card className="lg:col-span-1 border border-slate-800 bg-slate-900/60 p-5 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <CheckSquare className="w-4.5 h-4.5 text-indigo-400" />
              <span>سلاسل الاعتماد (Approvals)</span>
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              تحديد خطوات ومستويات اتخاذ القرار للمطالبات المالية والإجازات والمخرجات.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 p-1">
            {rules.map((rule) => {
              const isActive = selectedRule?.id === rule.id;
              return (
                <div
                  key={rule.id}
                  onClick={() => setSelectedRule(rule)}
                  className={`p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-indigo-600/10 border-indigo-500 text-white'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>سلسلة اعتماد: {rule.type}</span>
                  <Badge variant="outline" className="border-indigo-500/20 text-indigo-400">
                    مستوى: {rule.level}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Selected Approval Rule parameters */}
        <Card className="lg:col-span-2 border border-slate-800 bg-slate-900/60 p-6 rounded-3xl">
          {selectedRule ? (
            <div className="space-y-6 text-xs">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-indigo-400" />
                  <span>معايير اعتماد سلسلة: {selectedRule.type}</span>
                </h3>
                <p className="text-[10px] text-slate-500 mt-1">تحديد مستويات أصحاب القرار وأوقات التصعيد التلقائي للموافقات.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-slate-400 font-bold">الدور المسؤول عن الاعتماد</label>
                  <select
                    value={selectedRule.approverRole}
                    onChange={(e) => handleUpdateField('approverRole', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="Manager">مدير القسم (Manager)</option>
                    <option value="Owner">المالك / المدير التنفيذي (Owner)</option>
                    <option value="Finance">المحاسب المالي (Finance)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5 text-slate-400 font-bold">عدد مستويات الاعتماد المطلوبة</label>
                  <input
                    type="number"
                    value={selectedRule.level}
                    onChange={(e) => handleUpdateField('level', parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-slate-400 font-bold">زمن مهلة الـ SLA للموافقة (ساعات)</label>
                  <input
                    type="number"
                    value={selectedRule.slaHours}
                    onChange={(e) => handleUpdateField('slaHours', parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-slate-400 font-bold">مهلة التصعيد التلقائي عند الخمول (ساعات)</label>
                  <input
                    type="number"
                    value={selectedRule.autoEscalationHours}
                    onChange={(e) => handleUpdateField('autoEscalationHours', parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer">
                    <span className="text-slate-300">اعتماد تسلسلي (Sequential)</span>
                    <input
                      type="checkbox"
                      checked={selectedRule.isSequential}
                      onChange={(e) => handleUpdateField('isSequential', e.target.checked)}
                      className="w-4 h-4 accent-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer">
                    <span className="text-slate-300">فرض تدوين سبب الرفض</span>
                    <input
                      type="checkbox"
                      checked={selectedRule.reasonRequired}
                      onChange={(e) => handleUpdateField('reasonRequired', e.target.checked)}
                      className="w-4 h-4 accent-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer">
                    <span className="text-slate-300">فرض كتابة تعليق للاعتماد</span>
                    <input
                      type="checkbox"
                      checked={selectedRule.commentsRequired}
                      onChange={(e) => handleUpdateField('commentsRequired', e.target.checked)}
                      className="w-4 h-4 accent-indigo-500"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex justify-end">
                <Button onClick={handleSave} className="px-6 h-9">
                  حفظ قواعد الاعتماد
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">الرجاء تحديد نوع معاملة لعرض معايير الاعتماد والموافقة.</div>
          )}
        </Card>
      </div>
    </div>
  );
}
