import React from 'react';
import { TimelineMetricsSummary } from './TimelineMetricsSummary';
import { TimelineFilterBar } from './TimelineFilterBar';
import { TimelineItemCard } from './TimelineItemCard';
import { TimelineFilterOptions, timelineService } from '../../services/timeline.service';
import { Layers, Activity, FileText } from 'lucide-react';
import { motion } from 'motion/react';

export function CompanyTimelinePage() {
  const [filters, setFilters] = React.useState<TimelineFilterOptions>({
    category: 'ALL',
    department: 'ALL',
    severity: 'ALL',
    searchQuery: ''
  });

  const filteredEvents = React.useMemo(() => {
    return timelineService.getEvents(filters);
  }, [filters]);

  return (
    <div className="space-y-6 text-right font-sans">
      {/* Title Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-indigo-400" />
            <span>الخط الزمني للمؤسسة — Company Timeline</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            السجل المركزي الموحد ودفتر التدقيق الفوري لكافة العمليات المالية، والتشغيلية، والأمان، والذكاء الاصطناعي.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 px-4 py-2.5">
          <Activity className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
          <span className="text-[10px] text-slate-300 font-bold">بث تدقيق فوري ومباشر (Live Sync: OK)</span>
        </div>
      </div>

      {/* Visual Metrics summary bar */}
      <TimelineMetricsSummary />

      {/* Advanced filters component */}
      <TimelineFilterBar filters={filters} onChange={setFilters} />

      {/* Audit Log timeline feeds */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400">سجلات التدقيق المعروضة ({filteredEvents.length})</h3>
          <span className="text-[9px] text-slate-500 font-mono">ORDER: NEWEST_FIRST</span>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredEvents.map((evt, idx) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
              >
                <TimelineItemCard event={evt} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-12 border border-dashed border-slate-800 rounded-3xl text-center space-y-3 bg-slate-950/20">
            <FileText className="w-10 h-10 text-slate-700 mx-auto" />
            <div className="text-slate-400 font-bold text-xs">لا توجد سجلات تدقيق تطابق شروط التصفية الحالية</div>
            <p className="text-[10px] text-slate-600 max-w-sm mx-auto">حاول كتابة كلمات بحث أخرى أو تغيير تصنيف العمليات المحدد في الفلتر.</p>
          </div>
        )}
      </div>
    </div>
  );
}
export default CompanyTimelinePage;
