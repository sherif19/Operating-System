import React from 'react';
import { Customer, CustomerDeliverable } from '../../types/domain.types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomerJourneyApi } from '../../journey/api/journey.api';
import { Eye, EyeOff, Shield, Plus, ExternalLink } from 'lucide-react';

interface DeliverablesManagerProps {
  customer: Customer;
}

export function DeliverablesManager({ customer }: DeliverablesManagerProps) {
  const [deliverables, setDeliverables] = React.useState<CustomerDeliverable[]>([]);
  const [revealedIds, setRevealedIds] = React.useState<Record<string, boolean>>({});

  // Form states for creating new deliverables
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState<'file' | 'access_credential'>('file');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [url, setUrl] = React.useState('');

  React.useEffect(() => {
    CustomerJourneyApi.fetchDeliverables(customer.id).then(setDeliverables);
  }, [customer.id]);

  const handleToggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = async () => {
    if (!title) return;
    const newDel = await CustomerJourneyApi.addDeliverable({
      customerId: customer.id,
      stage: customer.currentStage,
      title,
      type,
      status: 'delivered',
      storageRefOrUrl: url || 'https://drive.google.com',
      version: 1,
      credentialsUsername: type === 'access_credential' ? username : undefined,
      credentialsCiphertext: type === 'access_credential' ? password : undefined,
    });
    setDeliverables((prev) => [...prev, newDel]);
    setTitle('');
    setUsername('');
    setPassword('');
    setUrl('');
  };

  return (
    <Card className="p-5">
      <h3 className="text-xs font-black text-white border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
        <Shield className="w-4 h-4 text-emerald-400" />
        <span>إدارة المخرجات والبيانات الحساسة للعميل</span>
      </h3>

      {/* List deliverables */}
      <div className="space-y-3">
        {deliverables.length > 0 ? (
          deliverables.map((del) => (
            <div
              key={del.id}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-white">{del.title}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  v{del.version} • {del.type === 'access_credential' ? 'بيانات دخول' : 'رابط ملف'}
                </span>
              </div>

              {del.type === 'access_credential' && del.credentialsCiphertext && (
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between text-[11px] font-mono mt-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-slate-500 font-sans">Username:</span>
                    <span className="text-white">{del.credentialsUsername}</span>
                    <span className="text-[9px] text-slate-500 font-sans mt-1">Password:</span>
                    <span className="text-indigo-300">
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
              )}

              {del.type !== 'access_credential' && (
                <a
                  href={del.storageRefOrUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-indigo-400 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>فتح الرابط والمجلد المشارك</span>
                </a>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-850 rounded-xl">
            لا توجد مخرجات مسندة للعميل حتى الآن.
          </div>
        )}
      </div>

      {/* Add deliverable inline form */}
      <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-3">
        <h4 className="text-xs font-bold text-white flex items-center gap-1">
          <Plus className="w-4 h-4 text-indigo-400" />
          <span>إضافة مخرج أو بيانات دخول جديدة</span>
        </h4>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="اسم المخرج (مثال: لوحة تحكم الموقع)"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder:text-slate-500"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="file">رابط مجلد / ملف</option>
            <option value="access_credential">بيانات تسجيل دخول</option>
          </select>
        </div>

        {type === 'access_credential' ? (
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="اسم المستخدم"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder:text-slate-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder:text-slate-500"
            />
          </div>
        ) : (
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="رابط الملف (Google Drive URL)"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder:text-slate-500"
          />
        )}

        <Button variant="outline" size="sm" onClick={handleAdd} className="w-full justify-center text-[10px]">
          حفظ المخرج وإرساله لمساحة عمل العميل
        </Button>
      </div>
    </Card>
  );
}
export default DeliverablesManager;
