import React from 'react';
import { Button } from '@/components/ui/button';
import { ChatInboxSidebar } from '../../../collaboration/components/chat-inbox-sidebar';
import { MessageBubbleRenderer } from '../../../collaboration/components/message-bubble-renderer';
import { MessageComposer } from '../../../collaboration/components/message-composer';
import { ChatDetailsDrawer } from '../../../collaboration/components/chat-details-drawer';
import { CollaborationApi } from '../../../collaboration/api/collaboration.api';
import { AISummarizerApi } from '../../../collaboration/api/ai-summarizer.api';
import { Conversation, Message, MessageFile } from '../../../collaboration/types/domain.types';
import { CustomerTasksApi } from '../../../customers/tasks/api/customer-tasks.api';
import { KnowledgeApi } from '../../../knowledge-base/api/knowledge.api';
import { Bot, Sparkles, Phone, Video, CheckCircle2, Pin, MessageSquare, UserPlus } from 'lucide-react';
import { NewChatModal } from '../../../collaboration/components/new-chat-modal';

export function CollaborationHubPage() {
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [aiSummary, setAiSummary] = React.useState<{ summary: string; tasks: string[] } | null>(null);
  const [notification, setNotification] = React.useState<string | null>(null);

  const [isNewChatOpen, setNewChatOpen] = React.useState(false);

  const loadInbox = React.useCallback(async () => {
    const list = await CollaborationApi.fetchConversations();
    setConversations(list);

    // If active ID is not in list, select first available conversation
    if (list.length > 0 && !list.some((c) => c.id === activeConvId)) {
      setActiveConvId(list[0].id);
    }
  }, [activeConvId]);

  const loadMessages = React.useCallback(async () => {
    if (!activeConvId) {
      setMessages([]);
      return;
    }
    const list = await CollaborationApi.fetchMessages(activeConvId);
    setMessages(list);
  }, [activeConvId]);

  const messagesContainerRef = React.useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom whenever messages or active conversation changes
  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, activeConvId]);

  React.useEffect(() => {
    loadInbox();
  }, [loadInbox]);

  React.useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const handleStartDirectChat = async (employeeId: string, employeeName: string) => {
    const conv = await CollaborationApi.startDirectChat(employeeId, employeeName);
    const list = await CollaborationApi.fetchConversations();
    setConversations(list);
    setActiveConvId(conv.id);
    showBanner(`💬 تم فتح محادثة خاصة مباشرة مع ${employeeName}`);
  };

  const handleSendMessage = async (text: string, voiceUrl?: string, file?: MessageFile, voiceDuration?: string) => {
    if (!activeConvId) return;
    const newMsg = await CollaborationApi.sendMessage(activeConvId, text, voiceUrl, file, voiceDuration);
    setMessages((prev) => [...prev, newMsg]);
    loadInbox();
  };

  const handleReact = async (msgId: string, emoji: string) => {
    await CollaborationApi.addReaction(msgId, emoji);
    loadMessages();
  };

  const handleMarkAllRead = async () => {
    await CollaborationApi.markAllAsRead();
    loadInbox();
    showBanner('✅ تم تحديد جميع المحادثات كمقروءة');
  };

  const handleResetChats = async () => {
    await CollaborationApi.clearAll();
    setConversations([]);
    setMessages([]);
    setActiveConvId('');
    showBanner('🗑️ تم تفريغ وتصفير المحادثات والقنوات بنجاح');
  };

  const handleConvertToTask = async (text: string) => {
    await CustomerTasksApi.createTask({
      customerId: 'cust-1',
      title: text,
      status: 'pending',
      priority: 'medium',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      isRequired: true,
      stage: 'registration',
    });
    showBanner('🔄 تم تحويل الرسالة بنجاح إلى مهمة عمل في قسم المبيعات!');
  };

  const handleConvertToSOP = async (text: string) => {
    await KnowledgeApi.createDocument({
      title: 'مسودة دليل عمل مستخرج من المحادثة',
      slug: `draft-sop-${Date.now()}`,
      summary: 'دليل عمل SOP مقترح تم استخراجه وتوليده تلقائياً من محادثة الموظفين.',
      body: text,
      type: 'SOP',
      authorId: 'emp-owner',
      departmentId: activeConv?.departmentId || 'dept-marketing',
      category: 'مسودات العمل المشتركة',
      tags: ['SOP', 'Draft', 'Collaboration'],
      status: 'draft',
      visibility: 'employee',
    });
    showBanner('📚 تم تصدير مسودة إجراء العمل SOP بنجاح لقاعدة المعرفة بانتظار المراجعة!');
  };

  const handleAISummarize = async () => {
    if (messages.length === 0) return;
    const result = await AISummarizerApi.summarizeMessages(messages);
    setAiSummary({
      summary: result.summary,
      tasks: result.suggestedTasks,
    });
  };

  const handleToggleMute = () => {
    if (!activeConv) return;
    const updated = conversations.map((c) =>
      c.id === activeConvId ? { ...c, isMuted: !c.isMuted } : c
    );
    setConversations(updated);
  };

  const showBanner = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // WhatsApp repeating background doodle style SVG pattern
  const whatsappDoodleBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm1-61c3.148 0 5.7-2.552 5.7-5.7 0-3.148-2.552-5.7-5.7-5.7-3.148 0-5.7 2.552-5.7 5.7 0 3.148 2.552 5.7 5.7 5.7zm29 57c3.148 0 5.7-2.552 5.7-5.7 0-3.148-2.552-5.7-5.7-5.7-3.148 0-5.7 2.552-5.7 5.7 0 3.148 2.552 5.7 5.7 5.7zM18 52c3.148 0 5.7-2.552 5.7-5.7 0-3.148-2.552-5.7-5.7-5.7-3.148 0-5.7 2.552-5.7 5.7 0 3.148 2.552 5.7 5.7 5.7zm33 3c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM45 20c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm21-6c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm-7-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm-20 6c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z'/%3E%3C/g%3E%3C/svg%3E\")`;

  return (
    <div className="dark flex flex-col h-[calc(100vh-100px)] bg-[#0b141a] border border-[#222e35] rounded-3xl overflow-hidden shadow-2xl relative text-[#e9edef]">
      {/* Top Banner Success Notification */}
      {notification && (
        <div className="absolute top-4 left-4 right-4 bg-[#00a884] text-[#111b21] p-3 rounded-xl z-50 text-xs font-black text-center shadow-lg border border-[#00a884] flex items-center justify-center gap-1.5 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4.5 h-4.5" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden h-full">
        {/* Left Side: Inbox List */}
        <ChatInboxSidebar
          conversations={conversations}
          activeId={activeConvId}
          onSelect={(id) => {
            setActiveConvId(id);
            setAiSummary(null);
          }}
          onStartDirectChat={handleStartDirectChat}
          onMarkAllRead={handleMarkAllRead}
          onResetChats={handleResetChats}
        />

        {/* Middle Area: Active Chat */}
        <div className="flex-1 flex flex-col justify-between h-full bg-[#0b141a] relative" style={{ backgroundImage: whatsappDoodleBg }}>
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-[#222e35]/30 bg-[#202c33] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#111b21] text-[#00a884] border border-[#222e35] flex items-center justify-center font-black text-sm overflow-hidden">
                    {activeConv.name[0]}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#e9edef]">{activeConv.name}</h3>
                    <span className="text-[9px] text-[#8696a0] flex items-center gap-1">
                      <Pin className="w-3 h-3 text-[#00a884]" />
                      <span>{activeConv.type === 'channel' ? 'قناة الأقسام المشتركة' : 'دردشة خاصة مباشرة'}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAISummarize}
                    className="h-8 text-[9px] border-[#00a884]/20 text-[#00a884] hover:bg-[#00a884]/15 bg-transparent gap-1 shadow-sm font-bold"
                  >
                    <Sparkles className="w-3 h-3 me-0.5" />
                    لخص المحادثة بـ AI
                  </Button>
                  <button className="p-2 rounded-lg text-[#aebac1] hover:text-white cursor-pointer hover:bg-[#2a3942] transition-colors">
                    <Phone className="w-4.5 h-4.5" />
                  </button>
                  <button className="p-2 rounded-lg text-[#aebac1] hover:text-white cursor-pointer hover:bg-[#2a3942] transition-colors">
                    <Video className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {/* AI Summary Block inside chat */}
              {aiSummary && (
                <div className="p-4 border-b border-[#222e35] bg-[#202c33]/95 text-xs text-[#e9edef] space-y-3 shrink-0">
                  <h4 className="font-bold text-[#00a884] flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-[#00a884]" />
                    <span>ملخص المحادثة التلقائي والمهام المقترحة بواسطة AI:</span>
                  </h4>
                  <p className="bg-[#111b21] p-2.5 rounded-lg border border-[#222e35] text-[11px] leading-relaxed text-[#e9edef]">
                    {aiSummary.summary}
                  </p>
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-[#8696a0] font-bold uppercase tracking-wider block">
                      المهام المستخرجة:
                    </span>
                    {aiSummary.tasks.map((task, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[10px] text-[#00a884]">
                        <span className="w-1 h-1 rounded-full bg-[#00a884]" />
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message List */}
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col no-scrollbar bg-transparent">
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <MessageBubbleRenderer
                      key={msg.id}
                      message={msg}
                      onReact={handleReact}
                      onConvertToTask={handleConvertToTask}
                      onConvertToSOP={handleConvertToSOP}
                    />
                  ))
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-[#8696a0] gap-2 p-8">
                    <MessageSquare className="w-10 h-10 text-[#00a884]/40" />
                    <span className="text-xs font-bold text-[#e9edef]">بدء محادثة خاصة جديدة</span>
                    <span className="text-[10px]">اكتب رسالتك الأولى أو ارسل تسجيلاً صوتياً للبدء.</span>
                  </div>
                )}
              </div>

              {/* Composer */}
              <MessageComposer onSend={handleSendMessage} />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center text-[#8696a0]">
              <div className="w-16 h-16 rounded-full bg-[#202c33] border border-[#222e35] flex items-center justify-center text-[#00a884] shadow-lg">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h3 className="text-sm font-extrabold text-[#e9edef]">مركز المراسلة والتعاون</h3>
                <p className="text-[11px] text-[#8696a0]">
                  اختر موظفاً من القائمة لبدء التراسل والمحادثات المباشرة، إرسال الصوت والملفات.
                </p>
              </div>

              <Button
                onClick={() => setNewChatOpen(true)}
                className="bg-[#00a884] hover:bg-[#008f72] text-[#111b21] font-extrabold text-xs px-5 h-9.5 rounded-xl shadow-lg flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>بدء دردشة مع موظف</span>
              </Button>
            </div>
          )}
        </div>

        {/* Right Side: Info Drawer */}
        {activeConv && (
          <ChatDetailsDrawer
            conversation={activeConv}
            onToggleMute={handleToggleMute}
          />
        )}
      </div>

      {/* Global New Chat Modal */}
      <NewChatModal
        isOpen={isNewChatOpen}
        onClose={() => setNewChatOpen(false)}
        onSelectEmployee={handleStartDirectChat}
      />
    </div>
  );
}
export default CollaborationHubPage;
