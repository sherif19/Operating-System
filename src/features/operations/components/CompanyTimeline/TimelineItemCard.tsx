import React from 'react';
import { TimelineEvent } from '../../types/timeline';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  Sparkles, 
  ShieldAlert, 
  User, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TimelineItemCardProps {
  event: TimelineEvent;
}

export function TimelineItemCard({ event }: TimelineItemCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Render proper icon based on event category
  const getCategoryIcon = () => {
    switch (event.category) {
      case 'FINANCE':
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case 'CUSTOMER_JOURNEY':
        return <MapPin className="w-4 h-4 text-purple-400" />;
      case 'APPOINTMENT':
        return <Calendar className="w-4 h-4 text-amber-400" />;
      case 'TASK_DELIVERABLE':
        return <CheckCircle className="w-4 h-4 text-indigo-400" />;
      case 'AUTOMATION_AI':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case 'SECURITY_SYSTEM':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
    }
  };

  // Label names for severity
  const getSeverityBadge = () => {
    switch (event.severity) {
      case 'CRITICAL':
        return <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] rounded-full">حرج (Critical)</Badge>;
      case 'WARNING':
        return <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] rounded-full">تحذير (Warning)</Badge>;
      default:
        return <Badge className="bg-slate-800 text-slate-400 border border-slate-700/60 text-[9px] rounded-full">معلومات (Info)</Badge>;
    }
  };

  const formattedTime = new Date(event.timestamp).toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const formattedDate = new Date(event.timestamp).toLocaleDateString('ar-EG', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-5 hover:bg-slate-900/60 transition-all duration-300 relative group overflow-hidden text-right text-xs">
      
      {/* Glow highlight on hover */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Main card grid */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left Side: Avatar, Title, Metadata Link */}
        <div className="flex items-start gap-3.5">
          {/* Avatar or Icon container */}
          <div className="w-10 h-10 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-center shrink-0">
            {event.actor.avatarUrl ? (
              <img src={event.actor.avatarUrl} alt={event.actor.name} className="w-full h-full rounded-2xl object-cover" />
            ) : (
              <User className="w-5 h-5 text-slate-500" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-black text-white text-[13px]">{event.title}</span>
              {getSeverityBadge()}
              <Badge variant="outline" className="border-slate-800 text-slate-500 bg-slate-950/40 text-[9px] rounded-full px-2 py-0.5 flex items-center gap-1.5">
                {getCategoryIcon()}
                <span>{event.category}</span>
              </Badge>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">{event.description}</p>
            
            {/* Entity Quick Navigation Link */}
            <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
              <span className="font-semibold">مرتبط بـ:</span>
              <a 
                href={event.relatedEntity.navigationUrl} 
                className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline flex items-center gap-1.5 transition-all"
              >
                <span>{event.relatedEntity.entityName}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Timestamp, Actor details, Expand Payload Button */}
        <div className="flex md:flex-col items-end justify-between md:justify-center w-full md:w-auto border-t md:border-t-0 border-slate-800/60 pt-3 md:pt-0 gap-3">
          <div className="text-left font-mono">
            <span className="text-[10px] text-indigo-400 font-bold block">{formattedTime}</span>
            <span className="text-[9px] text-slate-500 block">{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-[10px] text-slate-300 font-extrabold block">{event.actor.name}</span>
              {event.actor.role && <span className="text-[9px] text-slate-500 block">{event.actor.role}</span>}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-950 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center"
              title="عرض حمولة البيانات التفصيلية (JSON State Diff)"
            >
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable audit log details / state payload diff */}
      <AnimatePresence>
        {isOpen && event.metadata && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-slate-800/80 pt-4 space-y-3"
          >
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span className="font-bold">مقارنة حالات الحقول التشغيلية (JSON Payload Diff)</span>
              {event.metadata.executionTimeMs && (
                <span className="font-mono text-cyan-400/80">زمن المعالجة: {event.metadata.executionTimeMs}ms</span>
              )}
            </div>

            {/* Split diff viewer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] font-mono">
              {/* Before State */}
              <div className="bg-slate-950/80 border border-rose-500/10 p-3 rounded-2xl text-right">
                <span className="text-rose-400 font-bold block mb-1.5 border-b border-rose-500/5 pb-1">◀ الحالة السابقة (Before)</span>
                {event.metadata.beforeState ? (
                  <pre className="text-[9px] text-slate-400 overflow-x-auto select-all leading-normal">
                    {JSON.stringify(event.metadata.beforeState, null, 2)}
                  </pre>
                ) : (
                  <span className="text-slate-600 italic">لا توجد سجلات سابقة (سجل جديد)</span>
                )}
              </div>

              {/* After State */}
              <div className="bg-slate-950/80 border border-emerald-500/10 p-3 rounded-2xl text-right">
                <span className="text-emerald-400 font-bold block mb-1.5 border-b border-emerald-500/5 pb-1">◀ الحالة المحدثة (After)</span>
                {event.metadata.afterState ? (
                  <pre className="text-[9px] text-slate-400 overflow-x-auto select-all leading-normal">
                    {JSON.stringify(event.metadata.afterState, null, 2)}
                  </pre>
                ) : (
                  <pre className="text-[9px] text-slate-400 overflow-x-auto select-all leading-normal">
                    {JSON.stringify(event.metadata, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
