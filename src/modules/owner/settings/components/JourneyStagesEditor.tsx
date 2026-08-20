import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Map, Plus, Trash2, CheckCircle2, Sliders, Shield } from 'lucide-react';
import { JourneyStage } from '../types/settings.types';
import { settingsService } from '../services/settings.service';

import { useDialogStore } from '@/stores/dialog.store';

export function JourneyStagesEditor() {
  const { showAlert } = useDialogStore();
  const [stages, setStages] = React.useState<JourneyStage[]>([]);
  const [selectedStage, setSelectedStage] = React.useState<JourneyStage | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    const data = settingsService.getJourneyStages();
    setStages(data);
    if (data.length > 0) {
      setSelectedStage(data[0]);
    }
  }, []);

  const handleUpdateField = (key: keyof JourneyStage, val: any) => {
    if (!selectedStage) return;
    const updated = { ...selectedStage, [key]: val };
    setSelectedStage(updated);
    settingsService.updateJourneyStage(selectedStage.id, { [key]: val });
    setStages(stages.map((s) => (s.id === selectedStage.id ? updated : s)));
  };

  const handleCreateStage = () => {
    const newStage = settingsService.createJourneyStage({
      name: 'مرحلة جديدة - New Stage',
      description: 'وصف المرحلة التفصيلي هنا...',
      order: stages.length + 1,
      color: '#6366f1',
      icon: 'Map',
      visibility: 'everyone',
      prerequisites: [],
      tasks: [],
      articles: [],
      videos: [],
      appointments: [],
      deliverables: [],
      automations: [],
      conditions: [],
      tasksOpenedOnEntry: true,
      contentOpenedOnEntry: true,
      appointmentRequired: false,
      deliverableRequired: false,
      approvalRequired: false,
      qaRequired: false,
      requiredCompletionPct: 100,
      autoAdvance: true,
      manualAdvance: false,
      blockTransition: false,
      stageTimeoutHours: 24
    });

    setStages([...stages, newStage]);
    setSelectedStage(newStage);
    setSuccess('✅ تم إنشاء مرحلة تشغيلية جديدة بنجاح!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleDeleteStage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (stages.length <= 1) {
      showAlert('تنبيه الخصوصية والرحلات', '⚠️ لا يمكن حذف جميع مراحل رحلة العميل؛ يجب إبقاء مرحلة واحدة على الأقل!');
      return;
    }
    const result = settingsService.deleteJourneyStage(id);
    if (result) {
      const filtered = stages.filter((s) => s.id !== id);
      setStages(filtered);
      setSelectedStage(filtered[0] || null);
      setSuccess('🗑️ تم إقصاء وحذف المرحلة بنجاح!');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  return (
    <div className="space-y-6 text-right">
      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stages Sidebar */}
        <Card className="lg:col-span-1 border border-slate-800 bg-slate-900/60 p-5 rounded-3xl max-h-[700px] overflow-y-auto no-scrollbar">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-black text-white flex items-center gap-2">
                <Map className="w-4.5 h-4.5 text-indigo-400" />
                <span>مراحل الرحلة (Stages)</span>
              </CardTitle>
              <CardDescription className="text-[10px] text-slate-500">
                تسلسل مراحل رحلة العميل التشغيلية (Dynamic Stages).
              </CardDescription>
            </div>
            <Button size="icon" onClick={handleCreateStage} className="w-8 h-8 rounded-xl">
              <Plus className="w-4.5 h-4.5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 p-1">
            {stages.map((stage) => {
              const isActive = selectedStage?.id === stage.id;
              return (
                <div
                  key={stage.id}
                  onClick={() => setSelectedStage(stage)}
                  className={`p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-indigo-600/10 border-indigo-500 text-white'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                    <span className="font-mono text-[10px] text-indigo-400 font-extrabold">#{stage.order}</span>
                    <span>{stage.name}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteStage(stage.id, e)}
                    className="p-1 text-slate-500 hover:text-rose-500 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Selected Stage Parameters Editor */}
        <Card className="lg:col-span-2 border border-slate-800 bg-slate-900/60 p-6 rounded-3xl">
          {selectedStage ? (
            <div className="space-y-6 text-xs">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Sliders className="w-4.5 h-4.5 text-indigo-400" />
                    <span>محرر معايير المرحلة: {selectedStage.name}</span>
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1">تحديد الشروط والمحتويات المطلوبة لاجتياز هذه المرحلة.</p>
                </div>
                <Badge variant="outline" className="border-indigo-500/20 text-indigo-400">
                  ترتيب العرض: {selectedStage.order}
                </Badge>
              </div>

              {/* Main Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-slate-400 font-bold">اسم المرحلة (العربية والانجليزية)</label>
                  <input
                    type="text"
                    value={selectedStage.name}
                    onChange={(e) => handleUpdateField('name', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-slate-400 font-bold">لون التمييز (Color Tag)</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedStage.color}
                      onChange={(e) => handleUpdateField('color', e.target.value)}
                      className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedStage.color}
                      onChange={(e) => handleUpdateField('color', e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 font-mono text-[10px]"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1.5 text-slate-400 font-bold">الوصف والتفاصيل</label>
                  <textarea
                    value={selectedStage.description}
                    onChange={(e) => handleUpdateField('description', e.target.value)}
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              {/* Rules and Prerequisites */}
              <div className="border-t border-slate-800/60 pt-4 space-y-4">
                <h4 className="text-[11px] text-indigo-400 font-extrabold uppercase flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  <span>قواعد واشتراطات الدخول والخروج (Stage Rules)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer">
                    <span className="text-slate-300">فتح المهام فور الدخول</span>
                    <input
                      type="checkbox"
                      checked={selectedStage.tasksOpenedOnEntry}
                      onChange={(e) => handleUpdateField('tasksOpenedOnEntry', e.target.checked)}
                      className="w-4 h-4 accent-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer">
                    <span className="text-slate-300">عرض المحتوى فور الدخول</span>
                    <input
                      type="checkbox"
                      checked={selectedStage.contentOpenedOnEntry}
                      onChange={(e) => handleUpdateField('contentOpenedOnEntry', e.target.checked)}
                      className="w-4 h-4 accent-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer">
                    <span className="text-slate-300">موعد مطلوب (Appointment req)</span>
                    <input
                      type="checkbox"
                      checked={selectedStage.appointmentRequired}
                      onChange={(e) => handleUpdateField('appointmentRequired', e.target.checked)}
                      className="w-4 h-4 accent-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer">
                    <span className="text-slate-300">تسليم مطلوب (Deliverable req)</span>
                    <input
                      type="checkbox"
                      checked={selectedStage.deliverableRequired}
                      onChange={(e) => handleUpdateField('deliverableRequired', e.target.checked)}
                      className="w-4 h-4 accent-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer">
                    <span className="text-slate-300">موافقة إشرافية مطلوبة</span>
                    <input
                      type="checkbox"
                      checked={selectedStage.approvalRequired}
                      onChange={(e) => handleUpdateField('approvalRequired', e.target.checked)}
                      className="w-4 h-4 accent-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer">
                    <span className="text-slate-300">مراجعة QA مطلوبة</span>
                    <input
                      type="checkbox"
                      checked={selectedStage.qaRequired}
                      onChange={(e) => handleUpdateField('qaRequired', e.target.checked)}
                      className="w-4 h-4 accent-indigo-500"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block mb-1 text-slate-400">نسبة الإنجاز لاجتياز المرحلة</label>
                    <input
                      type="number"
                      value={selectedStage.requiredCompletionPct}
                      onChange={(e) => handleUpdateField('requiredCompletionPct', parseInt(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-400">التحول التلقائي للمرحلة التالية</label>
                    <select
                      value={selectedStage.autoAdvance ? 'true' : 'false'}
                      onChange={(e) => handleUpdateField('autoAdvance', e.target.value === 'true')}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                    >
                      <option value="true">تلقائي عند إنجاز الشروط (Auto Advance)</option>
                      <option value="false">يدوي بواسطة الموظف (Manual)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-400">مهلة التحذير للمرحلة (بالساعات)</label>
                    <input
                      type="number"
                      value={selectedStage.stageTimeoutHours}
                      onChange={(e) => handleUpdateField('stageTimeoutHours', parseInt(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">الرجاء اختيار مرحلة للبدء في تعديل الشروط وقواعد العبور.</div>
          )}
        </Card>
      </div>
    </div>
  );
}
