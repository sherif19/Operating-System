import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { SlaRule } from '../types/settings.types';
import { settingsService } from '../services/settings.service';

export function SlaManager() {
  const [rules, setRules] = React.useState<SlaRule[]>([]);
  const [selectedRule, setSelectedRule] = React.useState<SlaRule | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    const data = settingsService.getSlaRules();
    setRules(data);
    if (data.length > 0) {
      setSelectedRule(data[0]);
    }
  }, []);

  const handleUpdateField = (key: keyof SlaRule, val: any) => {
    if (!selectedRule) return;
    const updated = { ...selectedRule, [key]: val };
    setSelectedRule(updated);
    settingsService.updateSlaRule(selectedRule.id, { [key]: val });
    setRules(rules.map((r) => (r.id === selectedRule.id ? updated : r)));
  };

  const handleSave = () => {
    setSuccess('✅ تم تطبيق وتعميم اتفاقية مستوى الخدمة (SLA) بنجاح!');
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
        {/* Support categories selection */}
        <Card className="lg:col-span-1 border border-slate-800 bg-slate-900/60 p-5 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-indigo-400" />
              <span>فئات تذاكر الدعم التشغيلي</span>
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              تحديد أوقات الإنجاز المتوقعة SLA لكل نوع تذكرة.
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
                  <span>{rule.category}</span>
                  <Badge variant="outline" className="border-indigo-500/20 text-indigo-400 text-[10px]">
                    {rule.priority}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Selected Category SLA parameters */}
        <Card className="lg:col-span-2 border border-slate-800 bg-slate-900/60 p-6 rounded-3xl">
          {selectedRule ? (
            <div className="space-y-6 text-xs">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <ShieldAlert className="w-4.5 h-4.5 text-indigo-400" />
                  <span>معايير الاستجابة وحل التذاكر: {selectedRule.category}</span>
                </h3>
                <p className="text-[10px] text-slate-500 mt-1">
                  تحديد أقصى مهلة للرد الأول وحل الشكوى أو طلب التعديل للعملاء.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-slate-400 font-bold">الحد الأقصى للاستجابة المبدئية (ساعات)</label>
                  <input
                    type="number"
                    value={selectedRule.responseTimeHours}
                    onChange={(e) => handleUpdateField('responseTimeHours', parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-slate-400 font-bold">الحد الأقصى لمعالجة وإغلاق الطلب (ساعات)</label>
                  <input
                    type="number"
                    value={selectedRule.resolutionTimeHours}
                    onChange={(e) => handleUpdateField('resolutionTimeHours', parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-slate-400 font-bold">مستوى الخطورة والأولوية</label>
                  <select
                    value={selectedRule.priority}
                    onChange={(e) => handleUpdateField('priority', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="low">منخفضة (Low)</option>
                    <option value="medium">متوسطة (Medium)</option>
                    <option value="high">مرتفعة (High)</option>
                    <option value="critical">حرجة (Critical)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5 text-slate-400 font-bold">الدور المسؤول عن معالجة التذكرة</label>
                  <input
                    type="text"
                    value={selectedRule.owner}
                    onChange={(e) => handleUpdateField('owner', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-slate-400 font-bold">الدور للتصعيد التلقائي عند تجاوز المهلة</label>
                  <select
                    value={selectedRule.escalationRole}
                    onChange={(e) => handleUpdateField('escalationRole', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="Employee">موظف مختص (Employee)</option>
                    <option value="Manager">مدير القسم (Manager)</option>
                    <option value="Owner">المالك (Owner)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2.5 justify-center pl-2">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-300">احتساب ساعات العمل فقط (Working Hours)</span>
                    <input
                      type="checkbox"
                      checked={selectedRule.workingHoursOnly}
                      onChange={(e) => handleUpdateField('workingHoursOnly', e.target.checked)}
                      className="w-4 h-4 accent-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-300">تفعيل الإشعارات وتنبيهات التأخير</span>
                    <input
                      type="checkbox"
                      checked={selectedRule.notificationEnabled}
                      onChange={(e) => handleUpdateField('notificationEnabled', e.target.checked)}
                      className="w-4 h-4 accent-indigo-500"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex justify-end">
                <Button onClick={handleSave} className="px-6 h-9">
                  حفظ وتطبيق قواعد الـ SLA
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">الرجاء تحديد فئة دعم تشغيلي لعرض وتعديل قواعد الـ SLA.</div>
          )}
        </Card>
      </div>
    </div>
  );
}
