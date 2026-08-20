import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock3, RotateCcw, CheckCircle2 } from 'lucide-react';
import { SettingsVersion } from '../types/settings.types';
import { settingsService } from '../services/settings.service';

export function VersionHistoryPanel() {
  const [versions, setVersions] = React.useState<SettingsVersion[]>([]);
  const [success, setSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    setVersions(settingsService.getSettingsVersions());
  }, []);

  const handleRestore = async (versionId: string) => {
    const successRestore = await settingsService.restoreVersion(versionId);
    if (successRestore) {
      setSuccess(`✅ تم بنجاح استعادة وحفظ إعدادات النسخة تاريخياً: ${versionId}`);
      setVersions([...settingsService.getSettingsVersions()]);
      setTimeout(() => {
        setSuccess(null);
        // Refresh page state if needed
        window.location.reload();
      }, 2000);
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

      <Card className="border border-slate-800 bg-slate-900/60 p-6 rounded-3xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-white flex items-center gap-2">
            <Clock3 className="w-5 h-5 text-indigo-400" />
            <span>سجل إصدارات وتاريخ الإعدادات — Settings Version History</span>
          </CardTitle>
          <CardDescription>
            استعراض تاريخ تعديلات الإعدادات المتتالية، ومقارنة التعديلات السابقة والرجوع للنسخ التشغيلية القديمة.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-xs">
          {versions.map((v) => (
            <div key={v.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-extrabold text-white text-sm">نسخة: {v.id}</span>
                  <Badge variant="outline" className="border-indigo-500/20 text-indigo-400 bg-indigo-500/5 font-mono text-[10px]">
                    {v.timestamp}
                  </Badge>
                  <span className="text-[11px] text-slate-500">
                    بواسطة: <strong className="text-slate-300">{v.actor}</strong>
                  </span>
                </div>

                <p className="text-slate-400 leading-relaxed">
                  سبب التعديل: <strong>{v.reason}</strong>
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {v.changedKeys.map((k) => (
                    <Badge key={k} variant="outline" className="border-slate-800 text-slate-400 font-mono text-[9px]">
                      {k}: {String(v.beforeValues[k])} ➔ {String(v.afterValues[k])}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="shrink-0 flex items-center justify-end">
                <Button
                  onClick={() => handleRestore(v.id)}
                  className="bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/20 text-indigo-400 hover:text-white gap-1.5 h-9"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>استعادة هذه النسخة</span>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
