import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Palette, Eye, CheckCircle2 } from 'lucide-react';

interface BrandingPreviewProps {
  primaryColor: string;
  setPrimaryColor: (c: string) => void;
  secondaryColor: string;
  setSecondaryColor: (c: string) => void;
  accentColor: string;
  setAccentColor: (c: string) => void;
  successColor: string;
  setSuccessColor: (c: string) => void;
  dangerColor: string;
  setDangerColor: (c: string) => void;
  borderRadius: string;
  setBorderRadius: (r: string) => void;
}

export function BrandingPreview({
  primaryColor,
  setPrimaryColor,
  secondaryColor,
  setSecondaryColor,
  accentColor,
  setAccentColor,
  successColor,
  setSuccessColor,
  dangerColor,
  setDangerColor,
  borderRadius,
  setBorderRadius
}: BrandingPreviewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Configuration Controls */}
      <Card className="border border-slate-800/80 bg-slate-900/60 p-6 rounded-3xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-400" />
            <span>تهيئة الهوية البصرية — System Branding</span>
          </CardTitle>
          <CardDescription>
            تعديل وتحديد لوحة ألوان الهوية والشعارات وأسلوب تصميم أركان الحواف في جميع الشاشات.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-xs">
          {/* Color pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-slate-400 font-bold">اللون الأساسي (Primary)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[10px]"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-slate-400 font-bold">اللون الثانوي (Secondary)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[10px]"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-slate-400 font-bold">لون التمييز (Accent)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[10px]"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-slate-400 font-bold">لون النجاح (Success)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={successColor}
                  onChange={(e) => setSuccessColor(e.target.value)}
                  className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={successColor}
                  onChange={(e) => setSuccessColor(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[10px]"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-slate-400 font-bold">لون الخطورة (Danger)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={dangerColor}
                  onChange={(e) => setDangerColor(e.target.value)}
                  className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={dangerColor}
                  onChange={(e) => setDangerColor(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[10px]"
                />
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <label className="block mb-1.5 text-slate-400 font-bold">انحناء الأركان (Border Radius)</label>
              <select
                value={borderRadius}
                onChange={(e) => setBorderRadius(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="0px">حادة (0px)</option>
                <option value="8px">صغيرة (8px)</option>
                <option value="12px">ناعمة (12px)</option>
                <option value="20px">زجاجية دائرية (20px)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/60">
            <span className="text-[10px] text-slate-500">
              💡 يؤثر التعديل في مظهر لوحة القيادة وبوابات دخول العملاء فور الحفظ.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Live Preview Pane */}
      <Card className="border border-slate-800/80 bg-slate-900/60 p-6 rounded-3xl flex flex-col justify-between">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-400" />
            <span>المعاينة المباشرة — Live Preview</span>
          </CardTitle>
          <CardDescription>
            مثال حي لمحاكاة مظهر بطاقات وأزرار النظام بناءً على الإعدادات الحالية.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex items-center justify-center py-6">
          {/* Simulated Card using branding properties */}
          <div
            style={{ borderRadius }}
            className="w-full max-w-xs p-5 bg-gradient-to-br from-slate-950 to-slate-950/80 border border-slate-800 text-right shadow-2xl relative overflow-hidden transition-all duration-300"
          >
            {/* Accent Glowing Border Simulation */}
            <div
              style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }}
              className="absolute top-0 left-0 right-0 h-[2px]"
            />

            <h4 className="text-xs font-black text-white mb-2">بطاقة تجريبية للمعاينة</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
              نص محاكاة يوضح درجة وضوح وقراءة الألوان على خلفية النظام المظلمة.
            </p>

            {/* Actions list */}
            <div className="flex gap-2">
              <button
                style={{
                  backgroundColor: primaryColor,
                  borderRadius,
                  boxShadow: `0 4px 10px ${primaryColor}25`
                }}
                className="flex-1 py-1.5 text-[10px] font-bold text-white transition-all hover:opacity-90 cursor-pointer"
              >
                زر أساسي
              </button>

              <button
                style={{
                  borderColor: accentColor,
                  color: accentColor,
                  borderRadius
                }}
                className="flex-1 py-1.5 text-[10px] font-bold bg-transparent border transition-all hover:bg-slate-800/20 cursor-pointer"
              >
                تنبيه ملون
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[9px]">
              <span style={{ color: successColor }} className="font-extrabold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>حالة نجاح معينة</span>
              </span>
              <span style={{ color: dangerColor }} className="font-extrabold">
                تنبيه خطر
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
