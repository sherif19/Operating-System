import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CustomerJourneyApi } from '../../customers/journey/api/journey.api';
import { CustomerDeliverable } from '../../customers/types/domain.types';
import { Eye, EyeOff, ExternalLink, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function ClientDeliverablesPage() {
  const [deliverables, setDeliverables] = React.useState<CustomerDeliverable[]>([]);
  const [revealedIds, setRevealedIds] = React.useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    CustomerJourneyApi.fetchDeliverables('cust-1').then((data) => {
      setDeliverables(data);
      setIsLoading(false);
    });
  }, []);

  const handleToggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col gap-1">
          <Badge variant="default" className="w-fit bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-extrabold px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 me-1.5 animate-pulse" />
            المخرجات وبيانات الدخول المؤمّنة
          </Badge>
          <h1 className="text-2xl font-black text-white">تسليم المخرجات وحسابات النظام</h1>
          <p className="text-xs text-slate-400">
            تنزيل أصول التصميم المتكاملة والحصول على كلمات مرور الحسابات المنشأة بأمان كامل.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500">جاري تحميل المخرجات...</div>
        ) : deliverables.length > 0 ? (
          deliverables.map((del) => (
            <motion.div
              key={del.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-5 flex flex-col justify-between h-48 border border-blue-500/10 hover:border-cyan-500/30">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <h3 className="text-xs font-black text-white">{del.title}</h3>
                    <span className="text-[9px] text-slate-500 mt-1">النوع: {del.type} • النسخة: {del.version}</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] border-slate-800 text-slate-400">
                    {del.status}
                  </Badge>
                </div>

                {del.type === 'access_credential' && del.credentialsCiphertext ? (
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-850 flex items-center justify-between text-xs font-mono mt-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-slate-500 font-sans">Username:</span>
                      <span className="text-slate-200">{del.credentialsUsername}</span>
                      <span className="text-[9px] text-slate-500 font-sans mt-1">Password:</span>
                      <span className="text-indigo-400 font-bold">
                        {revealedIds[del.id] ? del.credentialsCiphertext : '••••••••••••••••'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggleReveal(del.id)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      {revealedIds[del.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-2 line-clamp-2">{del.description}</p>
                )}

                <div className="mt-4 pt-3 border-t border-slate-850 flex justify-between items-center text-[10px]">
                  <span className="text-slate-500">تم التسليم: {new Date(del.createdAt).toLocaleDateString('ar-SA')}</span>
                  {del.type !== 'access_credential' && (
                    <a
                      href={del.storageRefOrUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-indigo-400 hover:underline font-extrabold"
                    >
                      <span>تنزيل الملفات</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="p-16 text-center text-xs text-slate-400 col-span-2 bg-slate-900/40 rounded-2xl border border-dashed border-slate-850">
            لا توجد مخرجات جاهزة للتسليم حالياً في مساحة عملك.
          </div>
        )}
      </div>
    </div>
  );
}
export default ClientDeliverablesPage;
