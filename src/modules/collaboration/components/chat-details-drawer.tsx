import React from 'react';
import { Conversation, MessageFile } from '../types/domain.types';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, BellOff, Volume2, Shield, Download, FileArchive, Music, Image as ImageIcon } from 'lucide-react';
import { EmployeesDB } from '../../employees/services/employees-db';
import { CollaborationDB } from '../services/collaboration-db';

interface ChatDetailsDrawerProps {
  conversation: Conversation;
  onToggleMute: () => void;
}

export function ChatDetailsDrawer({ conversation, onToggleMute }: ChatDetailsDrawerProps) {
  const [activeTab, setActiveTab] = React.useState<'members' | 'media'>('members');

  const employees = EmployeesDB.getEmployees();

  // Role translating helper
  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'owner':
        return 'المالك والمدير التنفيذي';
      case 'manager':
        return 'مدير القسم';
      case 'trainer':
        return 'مدرب وخبير';
      case 'employee':
        return 'منفذ أعمال';
      case 'customer_service':
        return 'خدمة العملاء';
      default:
        return 'عضو الفريق';
    }
  };

  // Find shared files in messages of active conversation
  const conversationMessages = CollaborationDB.getMessages().filter(
    (m) => m.conversationId === conversation.id && m.file
  );

  return (
    <div className="w-full lg:w-72 border-r border-[#222e35] bg-[#111b21] flex flex-col h-full shrink-0">
      {/* Header Info */}
      <div className="p-4 border-b border-[#222e35] text-center flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-[#202c33] text-[#00a884] border border-[#222e35] flex items-center justify-center font-black text-lg shadow">
          {conversation.name[0]}
        </div>
        <h3 className="text-xs font-bold text-[#e9edef]">{conversation.name}</h3>
        <span className="text-[10px] text-[#8696a0]">
          {conversation.type === 'channel' ? 'قناة عامة' : 'دردشة مباشرة'}
        </span>
      </div>

      {/* Quick Settings Actions */}
      <div className="p-3 border-b border-[#222e35] flex justify-center">
        <button
          onClick={onToggleMute}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
            conversation.isMuted
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              : 'bg-[#202c33] border-[#222e35] text-slate-300 hover:text-white'
          }`}
        >
          {conversation.isMuted ? <BellOff className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#00a884]" />}
          <span>{conversation.isMuted ? 'إلغاء كتم التنبيهات' : 'كتم الإشعارات'}</span>
        </button>
      </div>

      {/* Tabs list switcher */}
      <div className="flex border-b border-[#222e35] bg-[#202c33]/40">
        {[
          { id: 'members', label: `الأعضاء (${conversation.members.length})`, icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'media', label: `الملفات (${conversationMessages.length})`, icon: <FileText className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 text-[10px] font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-[#00a884] text-white bg-[#202c33]/20'
                : 'border-transparent text-slate-500 hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab body content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 no-scrollbar">
        {activeTab === 'members' ? (
          <div className="space-y-2.5">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
              فريق العمل والمشاركين
            </span>
            <div className="space-y-2">
              {conversation.members.map((memId) => {
                const emp = employees.find((e) => e.id === memId);
                const isAdmin = conversation.admins.includes(memId);
                const displayName = emp?.name || (memId === 'emp-owner' ? 'م. أحمد العتيبي' : memId);
                const roleTitle = getRoleLabel(emp?.role);

                return (
                  <div
                    key={memId}
                    className="p-2.5 rounded-xl bg-[#202c33] border border-[#222e35] flex items-center justify-between text-xs hover:border-[#00a884]/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#111b21] border border-[#222e35] flex items-center justify-center text-[10px] font-black text-[#00a884] shrink-0">
                        {displayName[0]}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-[#e9edef] text-[11px] truncate">{displayName}</span>
                        <span className="text-[9px] text-[#8696a0] truncate">{roleTitle}</span>
                      </div>
                    </div>

                    {isAdmin && (
                      <Badge variant="outline" className="text-[8px] border-[#00a884]/30 text-[#00a884] flex items-center gap-0.5 bg-[#00a884]/10 shrink-0">
                        <Shield className="w-2.5 h-2.5" />
                        مشرف
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
              المستندات المشتركة
            </span>
            {conversationMessages.length > 0 ? (
              <div className="space-y-2">
                {conversationMessages.map((msg) => {
                  const file = msg.file as MessageFile;
                  return (
                    <div
                      key={msg.id}
                      className="p-2.5 rounded-xl bg-[#202c33] border border-[#222e35] flex items-center justify-between gap-2 text-xs hover:border-[#00a884]/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {file.type === 'image' ? (
                          <ImageIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : file.type === 'pdf' ? (
                          <FileText className="w-4 h-4 text-rose-400 shrink-0" />
                        ) : file.type === 'archive' ? (
                          <FileArchive className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : file.type === 'audio' ? (
                          <Music className="w-4 h-4 text-cyan-400 shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-[#e9edef] text-[10px] truncate">{file.name}</span>
                          <span className="text-[8px] text-[#8696a0] font-mono">{file.size}</span>
                        </div>
                      </div>

                      <a
                        href={file.url}
                        download={file.name}
                        className="p-1 rounded bg-[#111b21] hover:bg-[#00a884] hover:text-[#111b21] text-slate-400 transition-colors shrink-0"
                        title="تنزيل الملف"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 text-[10px]">
                لم يتم إرفاق أي ملفات في هذه المحادثة حتى الآن.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default ChatDetailsDrawer;
