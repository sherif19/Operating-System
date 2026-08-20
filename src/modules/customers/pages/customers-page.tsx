import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { CustomersApi } from '../api/customers.api';
import { Customer, CustomerInvite } from '../types/domain.types';
import { Search, UserPlus, Sparkles, Filter, ChevronLeft, Bot, Mail, Trash2, Copy } from 'lucide-react';
import { motion } from 'motion/react';
import { Dialog } from '@/components/ui/dialog';
import { useDialogStore } from '@/stores/dialog.store';

export function CustomersPage() {
  const navigate = useNavigate();
  const { showConfirm } = useDialogStore();
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [healthFilter, setHealthFilter] = React.useState<string>('all');
  const [isLoading, setIsLoading] = React.useState(true);

  // Invite creation modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);
  const [createdInvite, setCreatedInvite] = React.useState<CustomerInvite | null>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    CustomersApi.fetchAll().then((data) => {
      setCustomers(data);
      setIsLoading(false);
    });
  }, []);

  const handleCreateInvite = async () => {
    const invite = await CustomersApi.createInvite('org-1');
    setCreatedInvite(invite);
  };

  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
    setCreatedInvite(null);
  };

  const handleCopy = () => {
    if (!createdInvite) return;
    const textToCopy = `${window.location.origin}/auth/client-register?code=${createdInvite.inviteCode}`;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => fallbackCopy(textToCopy));
    } else {
      fallbackCopy(textToCopy);
    }
  };

  const fallbackCopy = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Fallback copy error:', err);
    }
    
    document.body.removeChild(textArea);
  };

  const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    showConfirm(
      'تأكيد حذف العميل نهائياً',
      `🚨 هل أنت متأكد من حذف العميل "${name}" نهائياً من النظام؟ سيتم محو كافة بياناته وتفعيل الـ Cloud Function لإلغاء حسابه بالكامل من Firebase Auth.`,
      async () => {
        await CustomersApi.deleteCustomer(id);
        setCustomers(customers.filter((c) => c.id !== id));
      }
    );
  };

  // Filter & Search Logic
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.assignedTrainerId || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesHealth = healthFilter === 'all' || c.health === healthFilter;

    return matchesSearch && matchesHealth;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col gap-1 z-10">
          <Badge variant="default" className="w-fit bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-extrabold px-3 py-1">
            <Sparkles className="w-3 h-3 me-1.5 animate-pulse" />
            إدارة علاقات وتجربة العملاء — CRM OS
          </Badge>
          <h1 className="text-2xl font-black text-white">دليل رحلات ومسارات العملاء</h1>
          <p className="text-xs text-slate-400">
            تتبع تقدم العملاء، صحة العلاقة التشغيلية، ومعاينة مساحات العمل الحية.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setIsInviteModalOpen(true)} className="gap-2 z-10">
          <UserPlus className="w-4 h-4" />
          <span>توليد رابط دعوة عميل</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-850 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم العميل، البريد، الشركة، أو الكوتش..."
            className="bg-slate-900 border-slate-800 pr-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 overflow-x-auto py-1">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          {[
            { id: 'all', label: 'كل العملاء' },
            { id: 'healthy', label: '🟢 سليم' },
            { id: 'attention', label: '🟡 يحتاج متابعة' },
            { id: 'at_risk', label: '🔴 في خطر' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setHealthFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                healthFilter === f.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-indigo-400 flex items-center justify-center gap-2">
          <Bot className="w-4 h-4 animate-spin" />
          <span>جاري تحميل قائمة العملاء...</span>
        </div>
      ) : filteredCustomers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((cust) => {
            const healthColor =
              cust.health === 'healthy'
                ? 'b-success'
                : cust.health === 'at_risk'
                ? 'b-critical'
                : 'b-warning';

            return (
              <motion.div
                key={cust.id}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                onClick={() => navigate(`/owner/customers/${cust.id}`)}
                className="card p-5 cursor-pointer flex flex-col justify-between h-64 border border-blue-500/10 hover:border-cyan-500/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 font-black flex items-center justify-center text-sm shadow-md">
                      {cust.name[0]}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-xs font-black text-white">{cust.name}</h3>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">{cust.companyName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`badge-v18 ${healthColor}`}>
                      {cust.health === 'healthy' ? 'سليم' : cust.health === 'at_risk' ? 'في خطر' : 'متابعة'}
                    </span>
                    <button
                      onClick={(e) => handleDelete(e, cust.id, cust.name)}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                      title="حذف العميل نهائياً"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>نسبة إنجاز المرحلة</span>
                    <span className="font-mono text-indigo-400">{cust.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-300"
                      style={{ width: `${cust.progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800/60 text-[10px] text-slate-400">
                  <div className="flex flex-col gap-0.5">
                    <span>المرحلة الحالية:</span>
                    <span className="font-bold text-white truncate">{cust.currentStage}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span>المدرب المسؤول:</span>
                    <span className="font-bold text-white truncate">{cust.assignedTrainerId || 'غير مسند'}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[9px] text-slate-500">
                  <span>انضم: {cust.joinedAt}</span>
                  <span className="text-indigo-400 font-extrabold flex items-center gap-0.5">
                    <span>عرض مساحة العمل</span>
                    <ChevronLeft className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-dashed border-slate-850">
          لم يتم العثور على عملاء يطابقون خيارات البحث والفلترة.
        </div>
      )}

      {/* Invite Link generator modal */}
      <Dialog isOpen={isInviteModalOpen} onClose={handleCloseInviteModal}>
        <div className="text-center flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-lg mb-2">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-base font-extrabold text-white">توليد رابط دعوة عميل جديد</h3>
          <p className="text-xs text-slate-400">
            توليد كود دعوة فريد ومقيد بوقت لمنع التسجيل العشوائي للعملاء.
          </p>
        </div>

        {createdInvite ? (
          <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-center space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              رابط الدعوة المولد والجاهز للمشاركة
            </span>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[10px] text-cyan-400 break-all select-all flex flex-col gap-2 items-center">
              <div className="w-full bg-slate-950 p-2 rounded text-slate-300 text-left truncate">
                {`${window.location.origin}/auth/client-register?code=${createdInvite.inviteCode}`}
              </div>
              <button 
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-indigo-650 hover:bg-indigo-500 text-white transition-all cursor-pointer flex items-center gap-1.5 text-[11px] font-sans w-full justify-center"
              >
                {copied ? 'تم النسخ!' : <><Copy className="w-3.5 h-3.5" /> نسخ الرابط المباشر</>}
              </button>
            </div>
            <span className="text-[9px] text-slate-500 block">
              تنتهي صلاحية الرابط تلقائياً بعد 7 أيام.
            </span>
            <Button variant="outline" size="sm" onClick={handleCloseInviteModal} className="w-full">
              إغلاق
            </Button>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <Button variant="primary" size="md" onClick={handleCreateInvite} className="w-full justify-center">
              تأكيد التوليد والإنشاء
            </Button>
          </div>
        )}
      </Dialog>
    </div>
  );
}
export default CustomersPage;
