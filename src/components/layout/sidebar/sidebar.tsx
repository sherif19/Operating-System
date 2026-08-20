import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { FirebaseAuthService } from '@/lib/firebase/auth.service';
import { SidebarItem } from './sidebar-item';
import { cn } from '@/lib/utils/cn';
import {
  LayoutDashboard,
  Bot,
  CheckSquare,
  Bell,
  Clock,
  Users,
  Building2,
  UserCog,
  BookOpen,
  MessageSquare,
  Zap,
  DollarSign,
  BarChart3,
  Settings,
  Calendar,
  Package,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  LogOut,
  DownloadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DepartmentsService, Department } from '@/modules/departments/services/departments.service';
import { getIcon } from '@/modules/departments/pages/department-os-page';
import { usePwaStore } from '@/stores/pwa.store';

export function Sidebar() {
  const { user, currentOrganization, logout } = useAuthStore();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  const { isInstallable, isInstalled, setModalOpen } = usePwaStore();
  const [isDeptsOpen, setIsDeptsOpen] = React.useState(false);
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [showInstallBtn, setShowInstallBtn] = React.useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await FirebaseAuthService.logout();
    } catch (e) {
      console.warn('Signout completed');
    }
    logout();
    navigate('/auth/admin-login', { replace: true });
  };

  const role = user?.role || 'client';

  React.useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;

    setShowInstallBtn((isInstallable || isIOS) && !isStandalone);
  }, [isInstallable, isInstalled]);

  React.useEffect(() => {
    setDepartments(DepartmentsService.getDepartments());
    const handleUpdate = () => {
      setDepartments(DepartmentsService.getDepartments());
    };
    window.addEventListener('departments_updated', handleUpdate);
    return () => window.removeEventListener('departments_updated', handleUpdate);
  }, []);

  // Navigation Items per Role according to spec
  const getNavItems = () => {
    if (role === 'client') {
      return [
        { to: '/client/dashboard', icon: <LayoutDashboard />, label: 'الرئيسية' },
        { to: '/client/journey', icon: <Zap />, label: 'رحلتي التشغيلية' },
        { to: '/client/appointments', icon: <Calendar />, label: 'مواعيدي' },
        { to: '/client/tasks', icon: <CheckSquare />, label: 'مهامي' },
        { to: '/client/deliverables', icon: <Package />, label: 'ممتلكاتي ومخرجاتي' },
        { to: '/client/messages', icon: <MessageSquare />, label: 'المحادثات والدعم' },
        { to: '/client/articles', icon: <BookOpen />, label: 'المقالات الإرشادية' },
        { to: '/client/ai-mentor', icon: <Bot />, label: 'المرشد الذكي (جو)' },
      ];
    }

    if (role === 'manager') {
      return [
        { to: '/manager/department', icon: <Building2 />, label: 'لوحة القسم' },
        { to: '/manager/customers', icon: <Users />, label: 'عملاء القسم' },
        { to: '/manager/team', icon: <UserCog />, label: 'فريق العمل' },
        { to: '/manager/tasks', icon: <CheckSquare />, label: 'إدارة المهام' },
        { to: '/manager/calendar', icon: <Calendar />, label: 'التقويم التشغيلي' },
        { to: '/manager/collaboration', icon: <MessageSquare />, label: 'مساحة التعاون' },
        { to: '/manager/reports', icon: <BarChart3 />, label: 'تحليل القسم' },
        { to: '/manager/ai-coach', icon: <Bot />, label: 'مستشار AI للقسم' },
      ];
    }

    if (role === 'employee' || role === 'trainer' || role === 'customer_service') {
      return [
        { to: '/employee/dashboard', icon: <LayoutDashboard />, label: 'مساحة عملي' },
        { to: '/employee/tasks', icon: <CheckSquare />, label: 'واجباتي ومهامي' },
        { to: '/employee/calendar', icon: <Calendar />, label: 'جدول المواعيد' },
        { to: '/employee/customers', icon: <Users />, label: 'العملاء المسندون' },
        { to: '/employee/collaboration', icon: <MessageSquare />, label: 'القنوات والمحادثات' },
        { to: '/employee/knowledge', icon: <BookOpen />, label: 'قاعدة المعرفة' },
        { to: '/employee/ai-mentor', icon: <Bot />, label: 'مساعد AI الشخصي' },
      ];
    }

    // Default: Owner / Admin (Full Company OS Navigation)
    return [
      { to: '/owner/mission-control', icon: <LayoutDashboard />, label: 'مركز القيادة' },
      { to: '/owner/ai-brain', icon: <Bot />, label: 'عقل الذكاء الاصطناعي' },
      { to: '/owner/approvals', icon: <CheckSquare />, label: 'الموافقات' },
      { to: '/owner/alerts', icon: <Bell />, label: 'مركز التنبيهات' },
      { to: '/owner/timeline', icon: <Clock />, label: 'الخط الزمني للشركة' },
      { to: '/owner/customers', icon: <Users />, label: 'إدارة العملاء' },
      { to: '/owner/departments', icon: <Building2 />, label: 'الأقسام والمكاتب' },
      { to: '/owner/employees', icon: <UserCog />, label: 'الموظفون والمدربون' },
      { to: '/owner/knowledge', icon: <BookOpen />, label: 'قاعدة المعرفة' },
      { to: '/owner/collaboration', icon: <MessageSquare />, label: 'مركز التعاون' },
      { to: '/owner/automations', icon: <Zap />, label: 'مركز الأتمتة' },
      { to: '/owner/finance', icon: <DollarSign />, label: 'المالية والميزانيات' },
      { to: '/owner/reports', icon: <BarChart3 />, label: 'التقارير التنفيذية' },
      { to: '/owner/settings', icon: <Settings />, label: 'الإعدادات والصلاحيات' },
    ];
  };

  return (
    <motion.aside
      animate={{ width: isSidebarCollapsed ? 80 : 260 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className="relative z-30 flex flex-col bg-[#0b0e1a]/95 backdrop-blur-xl select-none h-screen sticky top-0 overflow-visible shrink-0"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-900 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/25 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          {!isSidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col truncate"
            >
              <span className="text-sm font-extrabold tracking-tight text-white truncate">
                Company OS
              </span>
              <span className="text-[10px] font-semibold text-indigo-400 truncate">
                {currentOrganization?.name || 'أكاديمية المستبصرين'}
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating Modern Glass Collapse Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-6 end-[-12px] w-6 h-6 rounded-full bg-[#0b0e1a] border border-[#222e35] text-slate-400 hover:text-[#00a884] flex items-center justify-center shadow-lg transition-transform hover:scale-115 z-50 cursor-pointer"
      >
        {isSidebarCollapsed ? (
          <ChevronLeft className="w-3.5 h-3.5" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Vertical Glowing Separator Line */}
      <div className="absolute top-0 bottom-0 end-0 w-[1px] bg-gradient-to-b from-[#222e35]/15 via-indigo-500/25 to-[#222e35]/15 pointer-events-none z-45" />

      {/* Nav Menu Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 no-scrollbar">
        <AnimatePresence>
          {getNavItems().map((item) => {
            if (item.to === '/owner/departments') {
              return (
                <div key={item.to} className="flex flex-col gap-1">
                  {/* Parent Collapsible Tab */}
                  <NavLink
                    to={item.to}
                    onClick={() => setIsDeptsOpen(!isDeptsOpen)}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all select-none cursor-pointer h-10',
                        isActive
                          ? 'text-white bg-slate-800/20'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                      )
                    }
                  >
                    <div className="flex items-center gap-3 flex-1 text-inherit">
                      <span className="w-5 h-5 shrink-0 flex items-center justify-center transition-all group-hover:scale-115 duration-200">
                        {item.icon}
                      </span>
                      {!isSidebarCollapsed && <span>{item.label}</span>}
                    </div>
                    
                    {!isSidebarCollapsed && (
                      <span className="p-0.5 rounded text-slate-400 group-hover:text-white transition-all">
                        {isDeptsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </span>
                    )}
                  </NavLink>

                  {/* Submenu departments links */}
                  {isDeptsOpen && !isSidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mr-5 flex flex-col gap-1 mt-1 mb-1"
                    >
                      {departments.map((dept) => (
                        <NavLink
                          key={dept.id}
                          to={`/owner/departments?id=${dept.id}`}
                          className={({ isActive }) =>
                            cn(
                              'group relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all select-none cursor-pointer h-9',
                              isActive
                                ? 'text-white bg-slate-800/60'
                                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                            )
                          }
                        >
                          {/* Department Dynamic Icon */}
                          <span className="w-4 h-4 shrink-0 flex items-center justify-center transition-all group-hover:scale-110 duration-200">
                            {getIcon(dept.iconName, 'w-4 h-4 text-inherit')}
                          </span>

                          <span className="truncate transition-all">{dept.name}</span>
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </div>
              );
            }

            return (
              <SidebarItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                isCollapsed={isSidebarCollapsed}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* PWA Custom Install Button */}
      {showInstallBtn && (
        <div className="px-3 shrink-0 mb-1">
          <button
            onClick={() => setModalOpen(true)}
            className={cn(
              'group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all select-none cursor-pointer overflow-hidden text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 border border-indigo-500/20 shadow-lg shadow-indigo-500/5 h-10',
              isSidebarCollapsed && 'justify-center px-0'
            )}
            title="تثبيت التطبيق على جهازك"
          >
            <DownloadCloud className="w-5 h-5 shrink-0 transition-transform group-hover:scale-115 text-indigo-400" />
            {!isSidebarCollapsed && <span className="truncate">تثبيت التطبيق</span>}
          </button>
        </div>
      )}

      {/* Separator line */}
      <div className="h-[1px] bg-slate-900/60 mx-4 my-1 shrink-0" />

      {/* Logout Button */}
      <div className="p-3 shrink-0">
        <button
          onClick={handleLogout}
          className={cn(
            'group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all select-none cursor-pointer overflow-hidden text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 h-10',
            isSidebarCollapsed && 'justify-center px-0'
          )}
          title="تسجيل الخروج"
        >
          <LogOut className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
          {!isSidebarCollapsed && <span className="truncate">تسجيل الخروج</span>}
        </button>
      </div>
    </motion.aside>
  );
}
export default Sidebar;
