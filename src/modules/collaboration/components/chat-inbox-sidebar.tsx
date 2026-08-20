import React from 'react';
import { Conversation } from '../types/domain.types';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Hash, Lock, VolumeX, Pin, MessageSquarePlus, MoreVertical, Archive, CheckCheck, Trash2, UserPlus } from 'lucide-react';
import { NewChatModal } from './new-chat-modal';

interface ChatInboxSidebarProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onStartDirectChat: (employeeId: string, employeeName: string) => void;
  onMarkAllRead?: () => void;
  onResetChats?: () => void;
}

export function ChatInboxSidebar({
  conversations,
  activeId,
  onSelect,
  onStartDirectChat,
  onMarkAllRead,
  onResetChats,
}: ChatInboxSidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | 'direct' | 'group' | 'channel'>('all');
  const [isNewChatOpen, setNewChatOpen] = React.useState(false);
  const [isMenuOpen, setMenuOpen] = React.useState(false);

  const menuRef = React.useRef<HTMLDivElement | null>(null);

  // Close dropdown menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = conversations.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || c.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full lg:w-80 border-l border-[#222e35] bg-[#111b21] flex flex-col h-full shrink-0 relative">
      {/* Top Header */}
      <div className="p-3.5 flex items-center justify-between bg-[#111b21] border-b border-[#222e35]/40">
        <h2 className="text-base font-black text-[#e9edef]">WhatsApp</h2>
        <div className="flex items-center gap-2 text-[#aebac1] relative" ref={menuRef}>
          {/* New Chat Button */}
          <button
            onClick={() => setNewChatOpen(true)}
            className="p-1.5 rounded-lg hover:text-[#00a884] hover:bg-[#202c33] cursor-pointer transition-colors"
            title="بدء دردشة جديدة مع موظف"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </button>

          {/* Three Dots Menu Button */}
          <button
            onClick={() => setMenuOpen(!isMenuOpen)}
            className="p-1.5 rounded-lg hover:text-white hover:bg-[#202c33] cursor-pointer transition-colors"
            title="خيارات إضافية"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Three Dots Dropdown Menu Popover */}
          {isMenuOpen && (
            <div className="absolute top-10 left-0 bg-[#202c33] border border-[#222e35] py-2 rounded-2xl shadow-2xl z-50 min-w-48 text-right animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => {
                  setNewChatOpen(true);
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-xs text-[#e9edef] hover:bg-[#2a3942] flex items-center gap-2 justify-end cursor-pointer font-bold"
              >
                <span>بدء دردشة جديدة</span>
                <UserPlus className="w-4 h-4 text-[#00a884]" />
              </button>

              {onMarkAllRead && (
                <button
                  onClick={() => {
                    onMarkAllRead();
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-slate-300 hover:bg-[#2a3942] flex items-center gap-2 justify-end cursor-pointer font-bold"
                >
                  <span>تحديد جميع الرسائل كمقروءة</span>
                  <CheckCheck className="w-4 h-4 text-[#53bdeb]" />
                </button>
              )}

              {onResetChats && (
                <button
                  onClick={() => {
                    onResetChats();
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 justify-end cursor-pointer font-bold border-t border-[#222e35] mt-1 pt-2"
                >
                  <span>مسح وتصفير المحادثات</span>
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="px-3.5 pt-3 pb-2">
        <div className="relative">
          <Search className="w-4 h-4 text-[#8696a0] absolute right-3 top-2.5" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث أو بدء دردشة جديدة"
            className="bg-[#202c33] border-transparent text-[#e9edef] pr-9 text-xs h-9 rounded-lg focus-visible:ring-1 focus-visible:ring-[#00a884] placeholder:text-[#8696a0]"
          />
        </div>

        {/* Filter Quick Chips */}
        <div className="flex gap-1.5 mt-3 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'unread', label: 'غير مقروءة' },
            { id: 'direct', label: 'الرسائل الخاصة' },
            { id: 'channel', label: 'القنوات' },
          ].map((btn) => {
            const isChipActive = filter === btn.id || (btn.id === 'unread' && filter === 'all' && conversations.some(c => c.unreadCount > 0));
            return (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id === 'unread' ? 'all' : btn.id as any)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all cursor-pointer ${
                  isChipActive
                    ? 'bg-[#00a884] text-[#111b21]'
                    : 'bg-[#202c33] text-[#aebac1] hover:text-[#e9edef]'
                }`}
              >
                {btn.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Archived Conversations Row */}
      <button className="w-full flex items-center justify-between p-3.5 border-t border-[#222e35] bg-[#111b21] hover:bg-[#202c33] text-[#e9edef] text-xs font-bold cursor-pointer">
        <div className="flex items-center gap-3">
          <Archive className="w-4.5 h-4.5 text-[#00a884]" />
          <span>المؤرشفة</span>
        </div>
        <span className="text-[10px] text-[#00a884] font-extrabold bg-[#202c33] px-1.5 py-0.5 rounded-full">0</span>
      </button>

      {/* List items */}
      <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-[#222e35]/50 border-t border-[#222e35]">
        {filtered.length > 0 ? (
          filtered.map((c) => {
            const isSelected = activeId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`w-full text-right p-3.5 transition-all flex items-start gap-3 cursor-pointer relative ${
                  isSelected ? 'bg-[#2a3942]' : 'bg-transparent hover:bg-[#202c33]'
                }`}
              >
                {/* Channel Icon or Avatar */}
                <div className="w-11 h-11 rounded-full bg-[#202c33] border border-[#222e35] flex items-center justify-center shrink-0 overflow-hidden text-[#00a884]">
                  {c.type === 'channel' ? (
                    c.id === 'ch-finance' ? <Lock className="w-5 h-5 text-rose-500" /> : <Hash className="w-5 h-5 text-[#00a884]" />
                  ) : (
                    <span className="font-black text-sm text-[#00a884]">{c.name[0]}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#e9edef] truncate">{c.name}</span>
                    <span className={`text-[9px] font-mono shrink-0 ${c.unreadCount > 0 ? 'text-[#00a884] font-extrabold' : 'text-slate-500'}`}>{c.lastMessageTime}</span>
                  </div>

                  <p className="text-[10px] text-[#8696a0] truncate pr-0.5 leading-relaxed">
                    {c.lastMessageText}
                  </p>

                  <div className="flex items-center justify-end gap-1.5 mt-1">
                    {c.isMuted && <VolumeX className="w-3 h-3 text-[#8696a0]" />}
                    {c.pinnedMessages.length > 0 && <Pin className="w-3 h-3 text-[#8696a0]" />}
                    {c.unreadCount > 0 && (
                      <Badge className="bg-[#00a884] text-[#111b21] font-extrabold text-[9px] px-1.5 py-0.5 min-w-4 h-4 flex items-center justify-center rounded-full">
                        {c.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-[#8696a0] flex flex-col items-center gap-3">
            <span>لا توجد محادثات قائمة حالياً.</span>
            <button
              onClick={() => setNewChatOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#00a884] text-[#111b21] font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-md hover:bg-[#008f72] transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>بدء دردشة مع موظف</span>
            </button>
          </div>
        )}
      </div>

      {/* New Chat Employee Picker Modal */}
      <NewChatModal
        isOpen={isNewChatOpen}
        onClose={() => setNewChatOpen(false)}
        onSelectEmployee={onStartDirectChat}
      />
    </div>
  );
}
export default ChatInboxSidebar;
