import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils/cn';
import { motion } from 'motion/react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: string | number;
  isCollapsed?: boolean;
}

export function SidebarItem({ to, icon, label, badge, isCollapsed }: SidebarItemProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, x: -2 }}
      whileTap={{ scale: 0.99 }}
      className="relative"
    >
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all select-none cursor-pointer overflow-hidden h-10',
            isActive
              ? 'text-white'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
          )
        }
        title={isCollapsed ? label : undefined}
      >
        {({ isActive }) => (
          <>
            {/* Active Sliding Indicator Background */}
            {isActive && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-700 border-s-2 border-[#00a884] rounded-xl pointer-events-none -z-10 shadow-lg shadow-indigo-600/20"
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}

            <span className="w-5 h-5 shrink-0 flex items-center justify-center transition-all group-hover:scale-115 group-hover:rotate-3 duration-200">
              {icon}
            </span>

            {!isCollapsed && <span className="truncate transition-all">{label}</span>}

            {!isCollapsed && badge !== undefined && (
              <span className="me-0 ms-auto px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {badge}
              </span>
            )}
          </>
        )}
      </NavLink>
    </motion.div>
  );
}
export default SidebarItem;
