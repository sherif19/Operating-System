import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CustomerSupportApi } from '../../customers/support/api/tickets.api';
import { CustomerSupportTicket } from '../../customers/types/domain.types';
import { FirebaseStorageService } from '@/lib/firebase/storage.service';
import { CollaborationApi } from '../../collaboration/api/collaboration.api';
import { Conversation, Message } from '../../collaboration/types/domain.types';
import { useAuthStore } from '@/stores/auth.store';
import {
  Send,
  Plus,
  Sparkles,
  User,
  UserCheck,
  Paperclip,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  Loader2,
  HelpCircle
} from 'lucide-react';

export function ClientSupportPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = React.useState<'tickets' | 'live_chat'>('tickets');

  // Tickets state
  const [tickets, setTickets] = React.useState<CustomerSupportTicket[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  // New Ticket Form state
  const [subject, setSubject] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState<CustomerSupportTicket['category']>('technical');
  const [priority, setPriority] = React.useState<CustomerSupportTicket['priority']>('medium');
  const [attachments, setAttachments] = React.useState<string[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);

  // Reply Form state
  const [replyText, setReplyText] = React.useState('');
  const [replyAttachments, setReplyAttachments] = React.useState<string[]>([]);
  const [isReplyUploading, setIsReplyUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Live Chat State with Assigned Employee
  const [directConv, setDirectConv] = React.useState<Conversation | null>(null);
  const [chatMessages, setChatMessages] = React.useState<Message[]>([]);
  const [chatInputText, setChatInputText] = React.useState('');
  const [isChatSending, setIsChatSending] = React.useState(false);

  // Auto Scroll Refs to bring latest messages into view by default
  const ticketChatContainerRef = React.useRef<HTMLDivElement | null>(null);
  const liveChatContainerRef = React.useRef<HTMLDivElement | null>(null);

  const activeTicket = tickets.find((t) => t.id === selectedId);

  // Auto scroll ticket replies to bottom by default
  React.useEffect(() => {
    if (ticketChatContainerRef.current) {
      ticketChatContainerRef.current.scrollTop = ticketChatContainerRef.current.scrollHeight;
    }
  }, [selectedId, activeTicket?.replies, activeTab]);

  // Auto scroll live chat messages to bottom by default
  React.useEffect(() => {
    if (liveChatContainerRef.current) {
      liveChatContainerRef.current.scrollTop = liveChatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, activeTab]);

  const loadTickets = React.useCallback(async () => {
    const data = await CustomerSupportApi.fetchByCustomer('cust-1');
    setTickets(data);
    setIsLoading(false);
    if (data.length > 0 && !selectedId) {
      setSelectedId(data[0].id);
    }
  }, [selectedId]);

  React.useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  // Load or initialize Direct Chat with Assigned Employee (e.g., Omar / Youssef)
  React.useEffect(() => {
    CollaborationApi.startDirectChat('emp-1', 'يوسف الشريف (منفذ)').then((conv) => {
      setDirectConv(conv);
      CollaborationApi.fetchMessages(conv.id).then(setChatMessages);
    });
  }, []);

  // Handle uploading media for new ticket creation
  const handleUploadTicketMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const file = files[0];
      const url = await FirebaseStorageService.uploadChatFile('support_tickets_cust1', file, file.name);
      if (url) {
        setAttachments((prev) => [...prev, url]);
      }
    } catch (err) {
      console.error('Failed to upload ticket media', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle uploading media for ticket replies
  const handleUploadReplyMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsReplyUploading(true);
      const file = files[0];
      const url = await FirebaseStorageService.uploadChatFile('support_tickets_replies', file, file.name);
      if (url) {
        setReplyAttachments((prev) => [...prev, url]);
      }
    } catch (err) {
      console.error('Failed to upload reply media', err);
    } finally {
      setIsReplyUploading(false);
    }
  };

  // Submit New Ticket
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    try {
      setIsCreating(true);
      const newTicket = await CustomerSupportApi.createTicket(
        'cust-1',
        subject,
        description,
        category,
        priority,
        attachments,
        user?.displayName || 'سارة حسام (عميل)',
        'يوسف الشريف (منفذ)'
      );

      setTickets((prev) => [newTicket, ...prev]);
      setSelectedId(newTicket.id);
      setSubject('');
      setDescription('');
      setAttachments([]);
    } catch (err) {
      console.error('Failed to create ticket', err);
    } finally {
      setIsCreating(false);
    }
  };

  // Send reply to active ticket
  const handleSendReply = async () => {
    if (!selectedId || (!replyText.trim() && replyAttachments.length === 0)) return;

    try {
      const updated = await CustomerSupportApi.replyToTicket(
        selectedId,
        user?.displayName || 'سارة حسام (عميل)',
        'client',
        replyText,
        replyAttachments,
        'open'
      );

      setTickets((prev) => prev.map((t) => (t.id === selectedId ? updated : t)));
      setReplyText('');
      setReplyAttachments([]);
    } catch (e) {
      console.error('Failed to send reply', e);
    }
  };

  // Send message in Live Chat
  const handleSendLiveChatMessage = async () => {
    if (!directConv || !chatInputText.trim()) return;

    try {
      setIsChatSending(true);
      const newMsg = await CollaborationApi.sendMessage(directConv.id, chatInputText);
      setChatMessages((prev) => [...prev, newMsg]);
      setChatInputText('');
    } catch (err) {
      console.error('Failed to send chat message', err);
    } finally {
      setIsChatSending(false);
    }
  };

  // Helper badge color for status
  const getStatusBadge = (status: CustomerSupportTicket['status']) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-[10px]">مفتوحة</Badge>;
      case 'in_progress':
        return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px]">قيد المعالجة</Badge>;
      case 'waiting_for_customer':
        return <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30 text-[10px]">بانتظار ردك</Badge>;
      case 'resolved':
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">تم الحل</Badge>;
      case 'closed':
        return <Badge className="bg-slate-800 text-slate-400 border-slate-700 text-[10px]">مغلقة</Badge>;
    }
  };

  // Helper priority badge
  const getPriorityBadge = (p: CustomerSupportTicket['priority']) => {
    switch (p) {
      case 'critical':
        return <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/40 text-[9px] font-bold">طارئة</Badge>;
      case 'high':
        return <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/40 text-[9px] font-bold">عالية</Badge>;
      case 'medium':
        return <Badge className="bg-indigo-500/15 text-indigo-400 border-indigo-500/40 text-[9px] font-bold">متوسطة</Badge>;
      default:
        return <Badge className="bg-slate-800 text-slate-400 border-slate-700 text-[9px]">عادية</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6 text-right">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col gap-1">
          <Badge variant="default" className="w-fit bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-extrabold px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 me-1.5 animate-pulse" />
            Customer Support — مركز الدعم والشكاوى
          </Badge>
          <h1 className="text-2xl font-black text-white">مركز المساعدة والشكاوى والشات المباشر</h1>
          <p className="text-xs text-slate-400">
            ارفع تذاكر وشكاوى تفصيلية مع الميديا والملفات المرفقة، أو تواصل بالشات المباشر الفوري مع الموظف المعين.
          </p>
        </div>

        {/* Tabs Switcher */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-950/80 border border-slate-800 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'tickets'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>تذاكر الدعم والشكاوى ({tickets.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('live_chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'live_chat'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>الشات المباشر مع الموظف</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SUPPORT TICKETS & COMPLAINTS */}
      {activeTab === 'tickets' && (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Right Side Column: Submit Ticket Form & Ticket Directory */}
          <div className="w-full lg:w-96 flex flex-col gap-6 shrink-0">
            {/* Create Ticket Card */}
            <Card className="p-5 border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
              <h3 className="text-xs font-black text-white border-b border-slate-800 pb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-indigo-400" />
                  <span>تقديم شكوى / تذكرة دعم جديدة</span>
                </span>
                <Badge className="bg-indigo-500/10 text-indigo-400 text-[9px]">بيانات مكتملة</Badge>
              </h3>

              <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
                {/* Subject */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">عنوان الشكوى أو الطلب</label>
                  <input
                    required
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="مثال: خلل في ربط الدومين بالموقع..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Category & Priority Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">تصنيف المشكلة</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-[11px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="technical">خلل تقني / برمجي</option>
                      <option value="financial">استفسار مالي</option>
                      <option value="consultation">توجيه واستشارة</option>
                      <option value="bug">مشكلة وسيرفرات</option>
                      <option value="general">استفسار عام</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">درجة الأهمية</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-[11px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="low">عادية</option>
                      <option value="medium">متوسطة</option>
                      <option value="high">عالية</option>
                      <option value="critical">طارئة / حادة</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">وصف المشكلة بالتفصيل</label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="اكتب كافة التفاصيل والأعراض التي تواجهك..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* File Attachment Upload */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">إرفاق ميديا وتأكيد إثبات الخلل</label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 border border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-950/60 p-2.5 rounded-xl flex items-center justify-center gap-2 text-[11px] text-indigo-400 font-bold cursor-pointer transition-colors">
                      {isUploading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>جاري رفع الميديا...</span>
                        </>
                      ) : (
                        <>
                          <Paperclip className="w-3.5 h-3.5" />
                          <span>📸 اختر لقطة شاشة / مستند</span>
                        </>
                      )}
                      <input type="file" accept="image/*,.pdf,.doc" onChange={handleUploadTicketMedia} className="hidden" />
                    </label>
                  </div>

                  {/* Attachment previews */}
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {attachments.map((url, idx) => (
                        <div key={idx} className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden relative">
                          <img src={url} alt="Attachment" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button type="submit" variant="primary" size="sm" className="w-full justify-center text-xs font-extrabold h-9" isLoading={isCreating}>
                  <Send className="w-3.5 h-3.5 me-1.5" />
                  إرسال الشكوى لفريق الدعم
                </Button>
              </form>
            </Card>

            {/* Submitted Tickets Directory */}
            <Card className="p-5 border-slate-800 bg-slate-900/90 shadow-xl space-y-3">
              <h3 className="text-xs font-black text-white border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>سجل التذاكر والشكاوى السابقة</span>
                <span className="text-[10px] text-slate-500 font-mono">#{tickets.length}</span>
              </h3>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {isLoading ? (
                  <div className="text-center py-6 text-xs text-slate-500">جاري تحميل سجل الشكاوى...</div>
                ) : tickets.length > 0 ? (
                  tickets.map((t) => {
                    const isSelected = selectedId === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setSelectedId(t.id)}
                        className={`w-full text-right p-3 rounded-xl border transition-all cursor-pointer block relative ${
                          isSelected
                            ? 'bg-slate-800 border-indigo-500/50 text-white shadow-lg'
                            : 'bg-slate-950/40 text-slate-400 border-slate-900 hover:text-white hover:bg-slate-900/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-extrabold text-xs text-slate-200 truncate">{t.subject}</span>
                          {getPriorityBadge(t.priority)}
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-slate-500 mt-2 border-t border-slate-850 pt-2">
                          <span className="font-mono text-slate-400">#{t.id}</span>
                          {getStatusBadge(t.status)}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-xs text-slate-500">لا توجد شكاوى مسجلة حالياً.</div>
                )}
              </div>
            </Card>
          </div>

          {/* Left Side: Active Ticket Thread & Metadata (عرض تفاصيل الشكوى والردود) */}
          <div className="flex-1 w-full min-w-0">
            {activeTicket ? (
              <Card className="p-6 border-slate-800 bg-slate-900/90 shadow-2xl space-y-6">
                {/* Active Ticket Header & Metadata */}
                <div className="border-b border-slate-800 pb-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-slate-800 text-slate-400 font-mono text-[10px] border-slate-700">
                        #{activeTicket.id}
                      </Badge>
                      <h3 className="text-sm font-black text-white">{activeTicket.subject}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      {getPriorityBadge(activeTicket.priority)}
                      {getStatusBadge(activeTicket.status)}
                    </div>
                  </div>

                  {/* Metadata Chips Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-850 text-[11px] text-slate-400">
                    <div>
                      <span className="block text-[9px] text-slate-500 font-bold">الموظف المكلف:</span>
                      <strong className="text-indigo-400">{activeTicket.assignedStaffName || 'يوسف الشريف (منفذ)'}</strong>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-500 font-bold">التصنيف:</span>
                      <strong className="text-slate-200">{activeTicket.category?.toUpperCase() || 'TECHNICAL'}</strong>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-500 font-bold">تاريخ الإنشاء:</span>
                      <strong className="text-slate-300 font-mono">
                        {new Date(activeTicket.createdAt).toLocaleDateString('ar-EG')}
                      </strong>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850 text-xs text-slate-200 leading-relaxed">
                    <span className="block font-bold text-slate-400 text-[10px] mb-1">وصف الشكوى والمشكلة التفصيلي:</span>
                    {activeTicket.description}
                  </div>

                  {/* Ticket Attachments if any */}
                  {activeTicket.attachments && activeTicket.attachments.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                        <Paperclip className="w-3.5 h-3.5 text-indigo-400" />
                        <span>الملفات والميديا المرفقة مع الشكوى:</span>
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {activeTicket.attachments.map((url, idx) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative group shrink-0"
                          >
                            <img src={url} alt="Proof" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                              <ExternalLink className="w-4 h-4" />
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Reply Timeline Thread */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <span>سجل المحادثات والردود الحية ({activeTicket.replies.length})</span>
                  </h4>

                  <div ref={ticketChatContainerRef} className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                    {activeTicket.replies.map((rep, idx) => {
                      const isClient = rep.authorRole === 'client' || rep.authorName.includes('العميل') || rep.authorName.includes('سارة');
                      return (
                        <div key={idx} className={`flex gap-3 items-start ${isClient ? 'flex-row' : 'flex-row-reverse'}`}>
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                              isClient
                                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                                : 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                            }`}
                          >
                            {isClient ? <User className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </div>

                          <div className={`flex flex-col gap-1 max-w-[85%] ${isClient ? 'items-start' : 'items-end'}`}>
                            <div className="flex items-center gap-2 text-[9px] text-slate-500">
                              <span className="font-bold text-slate-300">{rep.authorName}</span>
                              <span className="font-mono">
                                {new Date(rep.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            <div
                              className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                                isClient
                                  ? 'bg-indigo-600/10 border border-indigo-500/20 text-slate-100 rounded-tr-none'
                                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                              }`}
                            >
                              {rep.text}

                              {/* Reply attachments if any */}
                              {rep.attachments && rep.attachments.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-800">
                                  {rep.attachments.map((url, aIdx) => (
                                    <a key={aIdx} href={url} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-lg bg-slate-900 overflow-hidden border border-slate-800">
                                      <img src={url} alt="Reply media" className="w-full h-full object-cover" />
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reply Composer */}
                  {activeTicket.status !== 'closed' ? (
                    <div className="pt-4 border-t border-slate-800 space-y-2">
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendReply();
                          }}
                          placeholder="اكتب رداً لفريق الدعم الفني والموظف المكلف..."
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />

                        {/* Reply Media Upload */}
                        <label className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-slate-400 hover:text-white cursor-pointer transition-colors">
                          {isReplyUploading ? <Loader2 className="w-4 h-4 animate-spin text-indigo-400" /> : <Paperclip className="w-4 h-4" />}
                          <input type="file" accept="image/*,.pdf" onChange={handleUploadReplyMedia} className="hidden" />
                        </label>

                        <Button variant="primary" size="sm" onClick={handleSendReply} className="h-10 px-5 font-bold">
                          <Send className="w-4 h-4 me-1" />
                          إرسال الرد
                        </Button>
                      </div>

                      {/* Pending Reply Attachments */}
                      {replyAttachments.length > 0 && (
                        <div className="flex items-center gap-2 text-[10px] text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>تم إرفاق {replyAttachments.length} ملفات مع الرد</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center text-xs text-slate-500">
                      🔒 هذه التذكرة مغلقة ولا يمكن إضافة ردود جديدة عليها.
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center text-xs text-slate-500 border-slate-800">
                اختر أحد الشكاوى من القائمة الجانبية أو قدم شكوى جديدة لعرض وتحديث المحادثة.
              </Card>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE CHAT WITH ASSIGNED EMPLOYEE (الشات المباشر الفوري) */}
      {activeTab === 'live_chat' && (
        <Card className="p-6 border-slate-800 bg-slate-900/90 shadow-2xl space-y-4 max-w-4xl mx-auto w-full">
          {/* Live Chat Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-extrabold text-xs">
                ي ش
              </div>
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <span>يوسف الشريف (منفذ)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </h3>
                <span className="text-[10px] text-slate-400 block">الموظف والمدرب المعين لمتابعة حسابك</span>
              </div>
            </div>

            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-500/10 text-xs">
              مباشر الآن 🟢
            </Badge>
          </div>

          {/* Messages Timeline */}
          <div ref={liveChatContainerRef} className="space-y-3.5 max-h-96 overflow-y-auto p-2 bg-slate-950/60 rounded-2xl border border-slate-850">
            {chatMessages.length > 0 ? (
              chatMessages.map((msg) => {
                const isMe = msg.senderId === user?.id || msg.senderName.includes('سارة');
                return (
                  <div key={msg.id} className={`flex gap-3 items-start ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        isMe
                          ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                          : 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                      }`}
                    >
                      {msg.senderName[0] || 'U'}
                    </div>

                    <div className={`flex flex-col gap-1 max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-2 text-[9px] text-slate-500">
                        <span className="font-bold text-slate-300">{msg.senderName}</span>
                        <span className="font-mono">{msg.createdAt}</span>
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20'
                            : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-xs text-slate-500">
                لا توجد رسائل سابقة. ابدأ المحادثة المباشرة الآن مع الموظف المعين!
              </div>
            )}
          </div>

          {/* Chat Composer */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={chatInputText}
              onChange={(e) => setChatInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendLiveChatMessage();
              }}
              placeholder="اكتب رسالتك للموظف المعين مباشرة..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <Button
              variant="primary"
              onClick={handleSendLiveChatMessage}
              isLoading={isChatSending}
              className="h-11 px-6 font-extrabold"
            >
              <Send className="w-4 h-4 me-1" />
              إرسال
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

export default ClientSupportPage;
