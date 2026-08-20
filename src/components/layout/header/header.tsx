import React from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { usePwaStore } from '@/stores/pwa.store';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { OrganizationPickerModal } from '@/components/navigation/organization-picker-modal';
import {
  Search,
  Bell,
  Sparkles,
  Building2,
  DownloadCloud
} from 'lucide-react';

export function Header() {
  const { user, currentOrganization } = useAuthStore();
  const { setCommandPaletteOpen, setProfileModalOpen } = useUIStore();
  const { isInstallable, isInstalled, setModalOpen } = usePwaStore();
  const [isOrgModalOpen, setIsOrgModalOpen] = React.useState(false);
  const [showInstallBtn, setShowInstallBtn] = React.useState(false);

  React.useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    setShowInstallBtn((isInstallable || isIOS) && !isStandalone);
  }, [isInstallable, isInstalled]);

  const roleLabels: Record<string, string> = {
    owner: 'المالك والمنفذ',
    admin: 'مدير النظام',
    manager: 'مدير قسم',
    employee: 'منفذ أعمال',
    trainer: 'مدرب',
    customer_service: 'خدمة العملاء',
    client: 'عميل الأكاديمية',
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-6 bg-slate-900/80 border-b border-slate-800/80 backdrop-blur-md select-none">
        {/* Search & Command Palette Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOrgModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-200 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all cursor-pointer"
            title="تبديل المؤسسة"
          >
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span>{currentOrganization?.name || 'Mohamed Joe Co.'}</span>
          </button>

          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-3 px-3.5 py-2 text-xs font-medium text-slate-400 bg-slate-950/60 hover:bg-slate-800/70 border border-slate-800 rounded-xl transition-all w-64 md:w-80 group cursor-pointer"
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
            <span>ابحث في الصفحات والعملاء والمهام...</span>
            <kbd className="me-0 ms-auto px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-900 border border-slate-700/60 rounded-md">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Quick AI Trigger */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>اسأل الذكاء الاصطناعي</span>
          </button>

          {/* Custom Branded PWA Install "Get App" Button */}
          {showInstallBtn && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-300 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 rounded-xl transition-all cursor-pointer shadow-sm animate-pulse"
              title="تثبيت التطبيق على جهازك (Get App)"
            >
              <DownloadCloud className="w-4 h-4 text-indigo-400" />
              <span className="hidden md:inline">تثبيت التطبيق</span>
              <span className="md:hidden">Get App</span>
            </button>
          )}

          {/* Notifications */}
          <button
            className="relative p-2.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
            title="التنبيهات"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 left-2 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-slate-900" />
          </button>

          <div className="h-6 w-px bg-slate-800 mx-1" />

          {/* User Profile Info */}
          <div
            onClick={() => setProfileModalOpen(true)}
            className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition-opacity"
            title="إعدادات الملف الشخصي"
          >
            <Avatar
              src={user?.avatarUrl}
              fallback={user?.displayName || 'OS'}
              size="md"
            />
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-100">
                {user?.displayName || 'المستخدم'}
              </span>
              <Badge variant="default" size="sm" className="w-fit mt-0.5 text-[10px] py-0 px-2">
                {roleLabels[user?.role || 'client']}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Organization Switcher Modal */}
      <OrganizationPickerModal
        isOpen={isOrgModalOpen}
        onClose={() => setIsOrgModalOpen(false)}
      />
    </>
  );
}

export default Header;
