import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Deliverable } from '@/types/domain.types';
import { Package, Download, ExternalLink, Eye, EyeOff, ShieldCheck, Copy, Check, Search } from 'lucide-react';

export function ClientDeliverablesPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSecrets, setShowSecrets] = React.useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const deliverables: (Deliverable & { details?: string; secretData?: string })[] = [
    {
      id: 'del-1',
      organizationId: 'org-1',
      customerId: 'cust-demo-1',
      stage: 'setup',
      title: 'شعار الهوية البصرية ودليل الألوان (Brand Kit)',
      type: 'file',
      status: 'delivered',
      storageRefOrUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      version: 1.2,
      publishedAt: '18 أغسطس 2026',
      createdAt: '18 أغسطس 2026',
      details: 'الملف يشمل صيغ SVG, PNG العالية الدقة مع خطوط الهوية والرابط المباشر.',
    },
    {
      id: 'del-2',
      organizationId: 'org-1',
      customerId: 'cust-demo-1',
      stage: 'setup',
      title: 'بيانات الوصول لحساب أدوات السوشيال ميديا الموثقة',
      type: 'access_credential',
      status: 'delivered',
      storageRefOrUrl: 'https://app.social-tools.com/login',
      version: 1.0,
      publishedAt: '19 أغسطس 2026',
      createdAt: '19 أغسطس 2026',
      details: 'اسم المستخدم: sara@mybusiness.com',
      secretData: 'Pass_Secure_9982#OS',
    },
    {
      id: 'del-3',
      organizationId: 'org-1',
      customerId: 'cust-demo-1',
      stage: 'execution',
      title: 'مجلد ملفات الميديا والتصاميم المعتمدة على Google Drive',
      type: 'link',
      status: 'delivered',
      storageRefOrUrl: 'https://drive.google.com/drive/folders/demo-deliverables',
      version: 2.0,
      publishedAt: '20 أغسطس 2026',
      createdAt: '20 أغسطس 2026',
      details: 'مجلد محمي يحتوي تصاميم السوشيال ميديا المجهزة للنشر.',
    },
  ];

  const filtered = deliverables.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSecret = (id: string) => {
    setShowSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex flex-col gap-1">
          <Badge variant="success" className="w-fit">
            <ShieldCheck className="w-3.5 h-3.5 me-1" />
            ممتلكاتي ومخرجاتي المعتمدة
          </Badge>
          <h1 className="text-2xl font-bold text-white">خزنة المخرجات وبيانات الوصول</h1>
          <p className="text-xs text-slate-400">
            جميع ما تم إنتاجه وتطويره لك محفوظ هنا مع إمكانية المعاينة والتحميل والنسخ الآمن.
          </p>
        </div>

        <div className="w-full md:w-72">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في المخرجات..."
            icon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
      </div>

      {/* Deliverables List */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((item) => (
          <Card key={item.id} className="hover:border-indigo-500/40 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                  <Package className="w-6 h-6" />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-white">{item.title}</h3>
                    <Badge variant="default" className="text-[10px]">
                      الإصدار v{item.version}
                    </Badge>
                    <Badge variant="success" className="text-[10px]">
                      تم التسليم ({item.publishedAt})
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{item.details}</p>

                  {/* Secure Password / Credential Display */}
                  {item.secretData && (
                    <div className="flex items-center gap-3 mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs w-fit">
                      <span className="font-semibold text-slate-400">كلمة المرور المشفرة:</span>
                      <span className="font-mono text-indigo-300 font-bold tracking-widest">
                        {showSecrets[item.id] ? item.secretData : '••••••••••••'}
                      </span>
                      <button
                        onClick={() => toggleSecret(item.id)}
                        className="p-1 text-slate-400 hover:text-white transition-colors ms-2"
                        title={showSecrets[item.id] ? 'إخفاء' : 'إظهار كلمة المرور'}
                      >
                        {showSecrets[item.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleCopy(item.id, item.secretData!)}
                        className="p-1 text-slate-400 hover:text-indigo-400 transition-colors"
                        title="نسخ"
                      >
                        {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <a href={item.storageRefOrUrl} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>فتح المعاينة</span>
                  </Button>
                </a>
                <a href={item.storageRefOrUrl} download>
                  <Button variant="primary" size="sm" className="gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    <span>تنزيل الملف</span>
                  </Button>
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
