import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '@/stores/ui.store';
import { Dialog } from '@/components/ui/dialog';
import {
  Search,
  LayoutDashboard,
  Users,
  CheckSquare,
  BookOpen,
  Bot,
  Zap,
  Settings,
  Sparkles,
  Building2,
  UserCheck
} from 'lucide-react';

interface SearchItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  category: string;
}

export function CommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const [query, setQuery] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  const baseItems: SearchItem[] = [
    { title: 'مركز القيادة الرئيسي (Mission Control)', icon: <LayoutDashboard />, path: '/owner/mission-control', category: 'الصفحات' },
    { title: 'عقل الذكاء الاصطناعي (AI Brain)', icon: <Bot />, path: '/owner/ai-brain', category: 'AI' },
    { title: 'مركز الموافقات والاعتمادات', icon: <CheckSquare />, path: '/owner/approvals', category: 'الموافقات' },
    { title: 'مركز التنبيهات وقواعد الخلل', icon: <Search />, path: '/owner/alerts', category: 'التنبيهات' },
    { title: 'الخط الزمني للشركة (Timeline)', icon: <Search />, path: '/owner/timeline', category: 'الخط الزمني' },
    { title: 'إدارة العملاء والرحلات', icon: <Users />, path: '/owner/customers', category: 'العملاء' },
    { title: 'قاعدة المعرفة والـ SOPs', icon: <BookOpen />, path: '/owner/knowledge', category: 'المعرفة' },
    { title: 'مركز الأتمتة (Automations)', icon: <Zap />, path: '/owner/automations', category: 'الأتمتة' },
    { title: 'إعدادات النظام وسجل التدقيق', icon: <Settings />, path: '/owner/settings', category: 'الإعدادات' },
  ];

  const customers: SearchItem[] = [
    { title: 'سارة حسام (Sara Hossam) — استراتيجية الـ AI', icon: <UserCheck />, path: '/owner/customers', category: 'العملاء' },
    { title: 'نور ستور (Nour Store) — صفحة الهبوط', icon: <UserCheck />, path: '/owner/customers', category: 'العملاء' },
    { title: 'خالد فتنس (Khaled Fitness) — إطلاق الحملة', icon: <UserCheck />, path: '/owner/customers', category: 'العملاء' },
    { title: 'منى بيوتي (Mona Beauty) — اكتشاف البراند', icon: <UserCheck />, path: '/owner/customers', category: 'العملاء' },
  ];

  const departments: SearchItem[] = [
    { title: 'قسم التسويق والمحتوى (Marketing)', icon: <Building2 />, path: '/owner/departments', category: 'الأقسام' },
    { title: 'قسم المبيعات والتحويل (Sales)', icon: <Building2 />, path: '/owner/departments', category: 'الأقسام' },
    { title: 'قسم التنفيذ والإنتاج (Execution)', icon: <Building2 />, path: '/owner/departments', category: 'الأقسام' },
    { title: 'قسم خدمة العملاء والدعم (Support)', icon: <Building2 />, path: '/owner/departments', category: 'الأقسام' },
  ];

  const employees: SearchItem[] = [
    { title: 'عمر (Omar) — Strategy Lead', icon: <UserCheck />, path: '/owner/employees', category: 'الموظفون' },
    { title: 'أحمد (Ahmed) — Developer', icon: <UserCheck />, path: '/owner/employees', category: 'الموظفون' },
    { title: 'منة (Mennah) — Designer', icon: <UserCheck />, path: '/owner/employees', category: 'الموظفون' },
  ];

  const allItems = [...baseItems, ...customers, ...departments, ...employees];

  const filteredItems = allItems.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    setCommandPaletteOpen(false);
    setQuery('');
    navigate(path);
  };

  return (
    <Dialog isOpen={isCommandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} className="p-0 overflow-hidden bg-slate-900 border-slate-800">
      <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex items-center gap-3">
        <Search className="w-5 h-5 text-indigo-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن صفحة، مهمة، عميل، أو قسم..."
          className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded"
          >
            مسح
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto p-2 space-y-1">
        {query.length > 0 && (
          <button
            onClick={() => handleSelect('/owner/ai-brain')}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 text-indigo-200 text-xs font-semibold hover:border-indigo-500/60 transition-all text-right"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>اسأل الذكاء الاصطناعي: "{query}"</span>
          </button>
        )}

        {filteredItems.length > 0 ? (
          filteredItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(item.path)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/70 text-slate-200 hover:text-white transition-colors text-right group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-slate-800 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {item.icon}
                </span>
                <span className="text-xs font-semibold">{item.title}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                {item.category}
              </span>
            </button>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            لم يتم العثور على نتائج تطابق "{query}"
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400">
        <span><b>⌘K</b> للفتح • استخدم الأسهم للتنقل</span>
        <span><b>ESC</b> للإغلاق</span>
      </div>
    </Dialog>
  );
}
