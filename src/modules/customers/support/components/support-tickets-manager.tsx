import React from 'react';
import { Customer, CustomerSupportTicket } from '../../types/domain.types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomerSupportApi } from '../api/tickets.api';
import { FirebaseStorageService } from '@/lib/firebase/storage.service';
import { Send, LifeBuoy, Paperclip, Loader2 } from 'lucide-react';

interface SupportTicketsManagerProps {
  customer: Customer;
}

export function SupportTicketsManager({ customer }: SupportTicketsManagerProps) {
  const [tickets, setTickets] = React.useState<CustomerSupportTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = React.useState<string | null>(null);
  const [replyText, setReplyText] = React.useState('');
  const [replyAttachments, setReplyAttachments] = React.useState<string[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);

  React.useEffect(() => {
    CustomerSupportApi.fetchByCustomer(customer.id).then((data) => {
      setTickets(data);
      if (data.length > 0 && !selectedTicketId) {
        setSelectedTicketId(data[0].id);
      }
    });
  }, [customer.id, selectedTicketId]);

  const activeTicket = tickets.find((t) => t.id === selectedTicketId);

  const repliesContainerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (repliesContainerRef.current) {
      repliesContainerRef.current.scrollTop = repliesContainerRef.current.scrollHeight;
    }
  }, [selectedTicketId, activeTicket?.replies]);

  const handleUploadReplyMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const url = await FirebaseStorageService.uploadChatFile('staff_ticket_replies', files[0], files[0].name);
      if (url) {
        setReplyAttachments((prev) => [...prev, url]);
      }
    } catch (err) {
      console.error('Failed to upload reply media', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedTicketId || (!replyText.trim() && replyAttachments.length === 0)) return;
    const updated = await CustomerSupportApi.replyToTicket(
      selectedTicketId,
      'يوسف الشريف (منفذ)',
      'staff',
      replyText,
      replyAttachments,
      'waiting_for_customer'
    );
    setTickets((prev) => prev.map((t) => (t.id === selectedTicketId ? updated : t)));
    setReplyText('');
    setReplyAttachments([]);
  };

  const handleStatusChange = async (ticketId: string, status: CustomerSupportTicket['status']) => {
    const updated = await CustomerSupportApi.replyToTicket(
      ticketId,
      'نظام التذاكر',
      'system',
      `تم تغيير حالة التذكرة إلى: ${status}`,
      undefined,
      status
    );
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? updated : t)));
  };

  return (
    <Card className="p-5 border-slate-800 bg-slate-900/90 text-right space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-xs font-black text-white flex items-center gap-2">
          <LifeBuoy className="w-4 h-4 text-rose-400" />
          <span>تذاكر الدعم والشكاوى المفتوحة للعميل ({tickets.filter((t) => t.status !== 'closed').length})</span>
        </h3>
        <span className="text-[10px] text-slate-500">العميل: <strong className="text-slate-300">{customer.name}</strong></span>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start">
        {/* Left column: tickets list */}
        <div className="w-full md:w-56 space-y-2 shrink-0 border-l border-slate-800/80 pl-2">
          {tickets.map((tkt) => (
            <button
              key={tkt.id}
              onClick={() => setSelectedTicketId(tkt.id)}
              className={`w-full text-right p-3 rounded-xl text-[11px] transition-all cursor-pointer block border ${
                selectedTicketId === tkt.id
                  ? 'bg-slate-800 text-white border-indigo-500/50 shadow-md'
                  : 'bg-slate-950/40 text-slate-400 border-slate-900 hover:text-white'
              }`}
            >
              <div className="font-extrabold truncate text-slate-200">{tkt.subject}</div>
              <div className="flex items-center justify-between text-[9px] text-slate-500 mt-2 border-t border-slate-850 pt-1.5">
                <span className="font-mono text-slate-400">#{tkt.id}</span>
                <span className="text-cyan-400 font-bold">{tkt.status}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right column: active conversation details */}
        <div className="flex-1 w-full min-w-0">
          {activeTicket ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 text-xs border-b border-slate-850 pb-3">
                <div>
                  <span className="font-extrabold text-white block">الموضوع: {activeTicket.subject}</span>
                  <span className="text-[10px] text-slate-400 font-mono">الرمز: #{activeTicket.id}</span>
                </div>

                {/* Status Selector Dropdown */}
                <select
                  value={activeTicket.status}
                  onChange={(e) => handleStatusChange(activeTicket.id, e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-lg text-[10px] text-cyan-400 font-bold px-2 py-1 cursor-pointer focus:outline-none"
                >
                  <option value="open">مفتوحة</option>
                  <option value="in_progress">قيد المعالجة</option>
                  <option value="waiting_for_customer">بانتظار العميل</option>
                  <option value="resolved">تم الحل</option>
                  <option value="closed">مغلقة</option>
                </select>
              </div>

              {/* Original Description */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-200 leading-relaxed">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">وصف المشكلة الكامل من العميل:</span>
                {activeTicket.description}
              </div>

              {/* Attachments if any */}
              {activeTicket.attachments && activeTicket.attachments.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400">الملفات المرفقة بالشكوى:</span>
                  <div className="flex flex-wrap gap-2">
                    {activeTicket.attachments.map((url, aIdx) => (
                      <a key={aIdx} href={url} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                        <img src={url} alt="Proof" className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages timeline */}
              <div ref={repliesContainerRef} className="space-y-3 max-h-56 overflow-y-auto p-1 border-t border-slate-850 pt-3">
                {activeTicket.replies.map((rep: any, idx: number) => {
                  const isStaff = rep.authorRole === 'staff' || rep.authorName.includes('منفذ') || rep.authorName.includes('الدعم');
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-xs leading-relaxed max-w-md ${
                        isStaff
                          ? 'bg-indigo-950/40 border border-indigo-500/20 mr-auto text-indigo-200'
                          : 'bg-slate-950 border border-slate-850 ml-auto text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[9px] text-slate-400 mb-1">
                        <span className="font-bold">{rep.authorName}</span>
                        <span className="font-mono">
                          {new Date(rep.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p>{rep.text}</p>
                      {rep.attachments && rep.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {rep.attachments.map((url: string, uIdx: number) => (
                            <a key={uIdx} href={url} target="_blank" rel="noreferrer" className="w-12 h-12 rounded bg-slate-900 border border-slate-800 overflow-hidden">
                              <img src={url} alt="Attachment" className="w-full h-full object-cover" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Reply composer */}
              {activeTicket.status !== 'closed' && (
                <div className="flex gap-2 mt-2 pt-3 border-t border-slate-850 items-center">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendReply();
                    }}
                    placeholder="اكتب رداً للعميل م. أحمد العتيبي / يوسف الشريف..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />

                  {/* Attachment upload */}
                  <label className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 text-slate-400 hover:text-white cursor-pointer">
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-indigo-400" /> : <Paperclip className="w-4 h-4" />}
                    <input type="file" accept="image/*,.pdf" onChange={handleUploadReplyMedia} className="hidden" />
                  </label>

                  <Button variant="primary" size="sm" onClick={handleSendReply} className="h-9 px-4 font-bold">
                    <Send className="w-3.5 h-3.5 me-1" />
                    إرسال الرد
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              اختر أحد التذاكر من القائمة الجانبية لعرض وتحديث المحادثة والردود.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default SupportTicketsManager;
