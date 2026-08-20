import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AuditLog } from '@/types/domain.types';

export function AuditLogPage() {
  const [search, setSearch] = React.useState('');

  const logs: AuditLog[] = [
    {
      id: 'log-1',
      organizationId: 'org-1',
      actorId: 'usr-owner-1',
      actorName: 'م. أحمد العتيبي (المالك)',
      action: 'UPDATE_ORGANIZATION_SETTINGS',
      resourceType: 'Organization',
      resourceId: 'org-1',
      timestamp: '2026-08-19 20:15:00',
      details: { timezone: 'Asia/Riyadh', updatedField: 'security_policy' },
    },
    {
      id: 'log-2',
      organizationId: 'org-1',
      actorId: 'usr-cs-1',
      actorName: 'مريم (خدمة العملاء)',
      action: 'VIEW_SECURE_CREDENTIAL',
      resourceType: 'Deliverable',
      resourceId: 'del-2',
      timestamp: '2026-08-19 19:40:00',
      details: { reason: 'تحقق بناء على طلب العميل' },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex flex-col gap-1">
          <Badge variant="default" className="w-fit">
            <ShieldCheck className="w-3.5 h-3.5 me-1 text-emerald-400" />
            سجل التدقيق والأمان الموحد — Audit Log
          </Badge>
          <h1 className="text-2xl font-bold text-white">سجل العمليات الحساسة وتتبع الأمان</h1>
          <p className="text-xs text-slate-400">
            تسجيل مشفر وغير قابل للتعديل لكافة الإجراءات الحساسة والتغييرات في الحسابات والصلاحيات.
          </p>
        </div>

        <div className="w-full md:w-72">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث في سجلات التدقيق..."
            icon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
      </div>

      {/* Log Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">الفاعل (Actor)</th>
                <th className="p-3.5">الحدث (Action)</th>
                <th className="p-3.5">الكيان (Resource)</th>
                <th className="p-3.5">التاريخ والتوقيت</th>
                <th className="p-3.5">التفاصيل المعالجة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-white">{log.actorName}</td>
                  <td className="p-3.5">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {log.action}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-indigo-300 font-medium">{log.resourceType}</td>
                  <td className="p-3.5 text-slate-400 font-mono">{log.timestamp}</td>
                  <td className="p-3.5 text-slate-300 font-mono text-[11px]">
                    {JSON.stringify(log.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
