import { Customer } from '../types/domain.types';
import { Card } from '@/components/ui/card';
import { ShieldAlert, CheckCircle, Activity, HeartCrack } from 'lucide-react';

interface CustomerHealthSectionProps {
  customer: Customer;
}

export function CustomerHealthSection({ customer }: CustomerHealthSectionProps) {
  const isHealthy = customer.health === 'healthy' || customer.health === 'completed';

  return (
    <Card className={`p-5 border ${isHealthy ? 'border-emerald-500/25 bg-emerald-950/5' : 'border-rose-500/25 bg-rose-950/5'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl shrink-0 ${isHealthy ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
          {isHealthy ? <CheckCircle className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
        </div>
        <div>
          <h3 className="text-xs font-black text-white flex items-center gap-2">
            <span>مؤشر صحة العميل التشغيلية</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
              {customer.health.toUpperCase()}
            </span>
          </h3>
          <p className="text-[10px] text-slate-400 mt-1">
            يتم تحديد صحة العميل بناءً على الالتزام بحضور المواعيد ومعدل إنجاز المهام المطلوبة.
          </p>
        </div>
      </div>

      {/* Reasons lists if not healthy */}
      {!isHealthy && customer.healthReason && customer.healthReason.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
          <span className="text-[9px] font-bold text-rose-400 flex items-center gap-1">
            <HeartCrack className="w-3.5 h-3.5" />
            أسباب تصنيف الحالة كـ (في خطر / يحتاج متابعة):
          </span>
          <ul className="space-y-1.5 pr-4 list-disc text-[10px] text-slate-300">
            {customer.healthReason.map((reason, idx) => (
              <li key={idx} className="leading-relaxed">
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {isHealthy && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 text-[10px] text-emerald-400 flex items-center gap-1.5">
          <Activity className="w-4 h-4" />
          <span>كل المؤشرات التشغيلية سليمة والعميل ملتزم بالـ SLA.</span>
        </div>
      )}
    </Card>
  );
}
