import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HardDrive, CheckCircle2, Settings2 } from 'lucide-react';
import { settingsService } from '../services/settings.service';

export function FilesStorageSettings() {
  const [success, setSuccess] = React.useState<string | null>(null);
  const [storageProvider, setStorageProvider] = React.useState('s3');
  const [maxFileSize, setMaxFileSize] = React.useState(50);
  const [allowedTypes, setAllowedTypes] = React.useState('pdf, png, jpg, zip, docx');
  const [urlExpiration, setUrlExpiration] = React.useState(15);
  const [imgCompression, setImgCompression] = React.useState(true);
  const [versioning, setVersioning] = React.useState(true);

  const handleSave = async () => {
    const res = await settingsService.saveSettings({
      storage_provider: storageProvider,
      storage_max_file_size_mb: maxFileSize,
      storage_allowed_types: allowedTypes,
      storage_url_expiration_min: urlExpiration,
      storage_image_compression: imgCompression,
      storage_versioning: versioning
    }, 'تعديل سياسات التخزين ومساحة الملفات المرفقة');

    if (res.success) {
      setSuccess('✅ تم تطبيق سقوف التخزين وسياسات ضغط الملفات بنجاح!');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  return (
    <div className="space-y-6 text-right text-xs">
      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storage Configuration */}
        <Card className="border border-slate-800 bg-slate-900/60 p-5 rounded-3xl space-y-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <HardDrive className="w-4.5 h-4.5 text-indigo-400" />
              <span>مساحة وحجم الملفات والتخزين السحابي</span>
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              توجيه التخزين السحابي المعتمد ووضع قيود صارمة على أحجام الملفات وصيغها المقبولة.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-slate-400">مزود خدمة التخزين المعتمد</label>
                <select
                  value={storageProvider}
                  onChange={(e) => setStorageProvider(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="s3">Amazon S3 Storage</option>
                  <option value="gcs">Google Cloud Storage</option>
                  <option value="local">سيرفر محلي (Local Disk)</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-slate-400">الحد الأقصى لحجم الملف (MB)</label>
                <input
                  type="number"
                  value={maxFileSize}
                  onChange={(e) => setMaxFileSize(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-slate-400 font-bold">الامتدادات والملفات المسموح برفعها</label>
              <input
                type="text"
                value={allowedTypes}
                onChange={(e) => setAllowedTypes(e.target.value)}
                placeholder="pdf, png, jpg, zip"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-left"
              />
            </div>
          </CardContent>
        </Card>

        {/* Compression and Expiring Link Rules */}
        <Card className="border border-slate-800 bg-slate-900/60 p-5 rounded-3xl space-y-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <Settings2 className="w-4.5 h-4.5 text-indigo-400" />
              <span>أمان الروابط المشفرة وضغط المرفقات</span>
            </CardTitle>
            <CardDescription className="text-[10px] text-slate-500">
              تهيئة صلاحيات الروابط المؤقتة الموقعة سحابياً (Signed URLs) لتأمين مستندات العملاء.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-1">
            <div>
              <label className="block mb-1 text-slate-400 font-bold">صلاحية الروابط المؤقتة المشفرة (دقائق)</label>
              <input
                type="number"
                value={urlExpiration}
                onChange={(e) => setUrlExpiration(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer">
                <span className="text-slate-300">ضغط الصور تلقائياً (Compression)</span>
                <input
                  type="checkbox"
                  checked={imgCompression}
                  onChange={(e) => setImgCompression(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer">
                <span className="text-slate-300">تفعيل حفظ تاريخ نسخ الملفات (Versioning)</span>
                <input
                  type="checkbox"
                  checked={versioning}
                  onChange={(e) => setVersioning(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500"
                />
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <Button onClick={handleSave} className="px-6 h-9">
                حفظ سياسة الملفات
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
