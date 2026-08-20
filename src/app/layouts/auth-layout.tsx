import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
// @ts-ignore
import desertDuneImg from '../../modules/authentication/pages/desert_dune.png';
// @ts-ignore
import clientBgImg from '../../modules/authentication/pages/client_bg.png';
// @ts-ignore
import employeeBgImg from '../../modules/authentication/pages/employee_bg.png';

export function AuthLayout() {
  const location = useLocation();
  const path = location.pathname;

  let leftImg = desertDuneImg;
  let title = 'Company OS';
  let desc = 'نظام تشغيل وإدارة المؤسسة المتكامل';
  let tag = 'تحكم كامل بالعمليات، المبيعات، ومؤشرات الأداء';
  let orbColor1 = 'from-rose-600/10'; 
  let orbColor2 = 'from-amber-600/5';
  let gridColor = '#f43f5e'; // Red-Rose grid line for Admin

  if (path.includes('client-login') || path.includes('client-register')) {
    leftImg = clientBgImg;
    title = 'Success & Growth';
    desc = 'بوابة العملاء والمشتركين';
    tag = 'تتبع نمو أعمالك ومشاريعك وتفاعل مباشرة مع فريق العمل';
    orbColor1 = 'from-purple-600/10';
    orbColor2 = 'from-violet-600/5';
    gridColor = '#a855f7'; // Purple grid line for Clients
  } else if (path.includes('employee-login') || path.includes('employee-register')) {
    leftImg = employeeBgImg;
    title = 'Execution Hub';
    desc = 'بوابة فريق العمل والمنفذين';
    tag = 'إدارة المهام اليومية، أوقات الاستجابة، ونظام الدعم التلقائي';
    orbColor1 = 'from-indigo-600/10';
    orbColor2 = 'from-cyan-600/5';
    gridColor = '#3b82f6'; // Indigo/Cyan grid line for Employees
  }

  return (
    <div className="min-h-screen bg-[#030614] flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans select-none">
      {/* Background Neon Orbs */}
      <div className={`absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br ${orbColor1} to-transparent rounded-full blur-[140px] pointer-events-none`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-tl ${orbColor2} to-transparent rounded-full blur-[140px] pointer-events-none`} />

      {/* Cyber-Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${gridColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
          `,
          backgroundSize: '45px 45px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }}
      />

      {/* Outer wrapper to contain the two main panels */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center relative z-10 px-2">
        
        {/* Left Column: Starry Desert Dune Card */}
        <motion.div 
          key={leftImg} // Force re-animation when image transitions
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          className="hidden md:flex md:col-span-6 h-[680px] relative rounded-[32px] overflow-hidden border border-slate-900 shadow-[0_30px_70px_rgba(0,0,0,0.4)] group"
        >
          {/* Background Image */}
          <img 
            src={leftImg} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-10000 group-hover:scale-105"
          />
          
          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-95" />
          
          {/* Text Overlay at bottom */}
          <div className="absolute bottom-16 left-10 right-10 text-center text-white space-y-3.5">
            <h2 className="text-3xl font-black tracking-tight">{title}</h2>
            <p className="text-sm text-slate-200 font-medium leading-relaxed">{desc}</p>
            <div className="text-[9px] text-slate-500 font-mono tracking-[0.2em] uppercase leading-relaxed max-w-sm mx-auto">
              {tag}
            </div>
          </div>
        </motion.div>
        
        {/* Right Column: Portal Forms Outlet */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          className="col-span-1 md:col-span-6 flex justify-center relative"
        >
          {/* Tech Radial Glow behind form */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="w-full max-w-md relative z-10">
            <Outlet />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
