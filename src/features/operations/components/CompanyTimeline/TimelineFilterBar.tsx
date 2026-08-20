import React from 'react';
import { EventCategory } from '../../types/timeline';
import { TimelineFilterOptions, timelineService } from '../../services/timeline.service';
import { Search, Filter, Calendar } from 'lucide-react';

interface TimelineFilterBarProps {
  filters: TimelineFilterOptions;
  onChange: (newFilters: TimelineFilterOptions) => void;
}

export function TimelineFilterBar({ filters, onChange }: TimelineFilterBarProps) {
  const departments = React.useMemo(() => timelineService.getUniqueDepartments(), []);

  const categories: { label: string; value: EventCategory | 'ALL' }[] = [
    { label: 'الكل', value: 'ALL' },
    { label: 'المالية', value: 'FINANCE' },
    { label: 'رحلة العميل', value: 'CUSTOMER_JOURNEY' },
    { label: 'المواعيد', value: 'APPOINTMENT' },
    { label: 'المهام والمخرجات', value: 'TASK_DELIVERABLE' },
    { label: 'الذكاء الاصطناعي والأتمتة', value: 'AUTOMATION_AI' },
    { label: 'الأمان والنظام', value: 'SECURITY_SYSTEM' }
  ];

  const handleSelectCategory = (cat: EventCategory | 'ALL') => {
    onChange({ ...filters, category: cat });
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl space-y-4 text-right text-xs">
      {/* Top Search & Dropdown Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Search */}
        <div className="md:col-span-2 relative flex items-center">
          <input
            type="text"
            value={filters.searchQuery || ''}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            placeholder="بحث نصي بالحدث، الموظف، أو التفاصيل..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pr-10 pl-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/80 transition-all font-sans"
          />
          <Search className="absolute right-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>

        {/* Department Filter */}
        <div className="relative">
          <select
            value={filters.department || 'ALL'}
            onChange={(e) => onChange({ ...filters, department: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500/80 transition-all cursor-pointer"
          >
            <option value="ALL">كل الأقسام (All Departments)</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Severity Filter */}
        <div>
          <select
            value={filters.severity || 'ALL'}
            onChange={(e) => onChange({ ...filters, severity: e.target.value as any })}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500/80 transition-all cursor-pointer"
          >
            <option value="ALL">جميع مستويات الخطورة (Severity)</option>
            <option value="INFO">عادي (INFO)</option>
            <option value="WARNING">تحذير (WARNING)</option>
            <option value="CRITICAL">حرج (CRITICAL)</option>
          </select>
        </div>
      </div>

      {/* Categories Pills & Date Pickers */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-2 border-t border-slate-800/60">
        
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-slate-500 font-bold ml-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            التصنيف:
          </span>
          {categories.map((cat) => {
            const isActive = (filters.category || 'ALL') === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => handleSelectCategory(cat.value)}
                className={`px-3.5 py-1.5 rounded-full border text-[11px] font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Date Pickers */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <Calendar className="w-4 h-4 text-slate-500" />
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => onChange({ ...filters, dateFrom: e.target.value || undefined })}
            className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-[11px] text-slate-200 focus:outline-none"
          />
          <span className="text-slate-600">إلى</span>
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => onChange({ ...filters, dateTo: e.target.value || undefined })}
            className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-[11px] text-slate-200 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
