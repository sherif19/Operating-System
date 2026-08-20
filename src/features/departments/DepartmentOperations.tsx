import React from 'react';
import { DepartmentOSService } from './services/departments.service';
import { DepartmentOperationDeliverable } from './types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, UserCheck, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export function DepartmentOperations() {
  const [deliverables, setDeliverables] = React.useState<DepartmentOperationDeliverable[]>([]);
  const [filterStatus, setFilterStatus] = React.useState<string>('ALL');
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    setDeliverables(DepartmentOSService.getDeliverables());
  }, []);

  const filtered = deliverables.filter((d) => {
    const matchesStatus = filterStatus === 'ALL' || d.status === filterStatus;
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.assignedStaff.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 text-right">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-[10px]">
              Operations & Deliverables — عمليات المخرجات
            </Badge>
            <span className="text-[10px] text-slate-400 font-mono">الإجمالي: {deliverables.length} عمليات</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">إدارة عمليات القسم والمخرجات</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            تتبع مراحل تنفيذ مخرجات العملاء، الالتزام بالجدول الزمني، واعتماد جودة التسليم.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="p-4 bg-slate-900/90 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث باسم المخرج، العميل، أو الموظف المكلف..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'الكل' },
            { id: 'IN_PROGRESS', label: 'قيد التنفيذ' },
            { id: 'UNDER_REVIEW', label: 'بانتظار الاعتماد' },
            { id: 'DELIVERED', label: 'تم التسليم' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilterStatus(btn.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterStatus === btn.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-850'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Deliverables Cards List or Empty State */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((del) => (
            <motion.div key={del.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-5 bg-slate-900/90 border-slate-800 shadow-xl space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-slate-700 text-slate-400 font-mono text-[9px]">
                      مرحلة: {del.stageName}
                    </Badge>
                    {del.status === 'UNDER_REVIEW' && (
                      <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[9px]">بانتظار الاعتماد ⏳</Badge>
                    )}
                    {del.status === 'IN_PROGRESS' && (
                      <Badge className="bg-indigo-500/15 text-indigo-400 border-indigo-500/30 text-[9px]">قيد التنفيذ 🛠️</Badge>
                    )}
                    {del.status === 'DELIVERED' && (
                      <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[9px]">مكتمل ومسلم ✅</Badge>
                    )}
                  </div>

                  <h3 className="text-sm font-black text-white leading-snug">{del.title}</h3>
                  <span className="text-[10px] text-slate-400 block">العميل: <strong className="text-slate-200">{del.clientName}</strong></span>
                </div>

                <div className="space-y-2 border-t border-slate-850 pt-3 text-xs text-slate-300">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-cyan-400" />
                      المسؤول:
                    </span>
                    <strong className="text-cyan-300">{del.assignedStaff}</strong>
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-indigo-400" />
                      تاريخ التسليم:
                    </span>
                    <span className="font-mono text-slate-200">{del.dueDate}</span>
                  </div>

                  {del.qualityScore && (
                    <div className="flex items-center justify-between text-[10px] bg-slate-950 p-2 rounded-xl border border-slate-850">
                      <span className="text-slate-400">مؤشر جودة المخرج:</span>
                      <strong className="text-emerald-400 font-mono font-bold">{del.qualityScore}% ممتاز</strong>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-12 bg-slate-900/60 border-slate-800 text-center space-y-3 shadow-xl">
          <div className="w-14 h-14 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-black text-white">لا توجد عمليات أو مخرجات جارية بالقسم حالياً (0 مخرجات)</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            ستظهر هنا كافة مخرجات ومشاريع العملاء فور بدء العمل عليها وتكليف أفراد الكادر بها.
          </p>
        </Card>
      )}
    </div>
  );
}

export default DepartmentOperations;
