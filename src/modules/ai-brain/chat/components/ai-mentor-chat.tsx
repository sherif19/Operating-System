import React from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArtifactRenderer, UIArtifactSchema } from '../../artifacts/components/artifact-renderer';
import { Bot, Send, Sparkles, RefreshCw, Crown, Settings, TrendingUp, Users, DollarSign, Megaphone, PenTool, Image, Video, Compass, Wrench } from 'lucide-react';
import { motion } from 'motion/react';

interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: string;
  learned: string;
  icon: React.ReactNode;
  memory: string[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  agentName?: string;
  artifact?: UIArtifactSchema;
}

export function AIMentorChat() {
  const { user } = useAuthStore();

  const agents: AIAgent[] = [
    {
      id: 'ceo',
      name: 'CEO AI',
      role: 'Chief Executive & Strategic Decision Maker',
      status: 'نشط',
      learned: '482 قرار استراتيجي',
      icon: <Crown className="w-4 h-4 text-amber-400" />,
      memory: ['الهدف طويل المدى: بناء شركة بمليار دولار قيمة', 'رفع معدل الاحتفاظ بالعملاء'],
    },
    {
      id: 'operations',
      name: 'Operations Manager AI',
      role: 'COO — يراقب كل الأقسام والـ Workflows',
      status: 'نشط',
      learned: '9 أقسام مراقَبة',
      icon: <Settings className="w-4 h-4 text-indigo-400" />,
      memory: ['متوسط 3 أيام لتسليم المشروع', 'SOP Enforcement لكشف الخطوات المتقفزة'],
    },
    {
      id: 'finance',
      name: 'Finance AI',
      role: 'CFO — Cashflow, Revenue, Tax, Payroll',
      status: 'نشط',
      learned: '1.2K معاملة',
      icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
      memory: ['التدفق النقدي مستقر آخر 3 شهور', 'تنبيه المحاسبين بمواعيد الضرايب'],
    },
    {
      id: 'hr',
      name: 'HR AI',
      role: 'CPO — دورة حياة الموظف كاملة',
      status: 'نشط',
      learned: '18 موظف',
      icon: <Users className="w-4 h-4 text-purple-400" />,
      memory: ['معدل رضا الموظفين الحالي 88%', 'خطة تحسين الأداء المجهزة'],
    },
    {
      id: 'sales',
      name: 'Sales Executive AI',
      role: 'مستشار مبيعات كبير — Follow-up Engine',
      status: 'نشط',
      learned: '210 صفقة',
      icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
      memory: ['متوسط دورة البيع 12 يوم', 'العملاء المهتمون بـ ROI بيقفلوا أسرع'],
    },
    {
      id: 'marketing',
      name: 'Marketing & Media Buyer AI',
      role: 'CMO + Senior Media Buyer',
      status: 'نشط',
      learned: '96 حملة',
      icon: <Megaphone className="w-4 h-4 text-pink-400" />,
      memory: ['حملات الفيديو القصير تفاعلها أعلى بـ 35%', 'ROAS optimization'],
    },
    {
      id: 'content',
      name: 'Content Creator AI',
      role: 'Chief Content Strategist',
      status: 'نشط',
      learned: '420 محتوى',
      icon: <PenTool className="w-4 h-4 text-sky-400" />,
      memory: ['المحتوى التعليمي بيحقق أعلى مشاركة', 'Content Review قبل النشر'],
    },
    {
      id: 'graphic_designer',
      name: 'Graphic Designer AI',
      role: 'Creative Director & Brand Guardian',
      status: 'نشط',
      learned: '64 تصميم',
      icon: <Image className="w-4 h-4 text-violet-400" />,
      memory: ['اتساق الهوية البصرية', 'كشف عدم اتساق الألوان والخطوط آلياً'],
    },
    {
      id: 'video_editor',
      name: 'Video Editor AI',
      role: 'Creative Video Director',
      status: 'نشط',
      learned: '38 فيديو',
      icon: <Video className="w-4 h-4 text-rose-400" />,
      memory: ['أول 3 ثواني بتحدد الاستمرار', 'Retention Analysis'],
    },
    {
      id: 'client_success',
      name: 'Client Success AI',
      role: 'الإرشاد المستمر لنجاح العميل',
      status: 'نشط',
      learned: '64 عميل',
      icon: <Compass className="w-4 h-4 text-blue-400" />,
      memory: ['Customer Health Score (0-100)', 'متابعة مراحل العميل التفاعلية'],
    },
    {
      id: 'client_setup',
      name: 'Client Setup Specialist AI',
      role: 'بوابة الجودة قبل التسويق — Setup كامل',
      status: 'نشط',
      learned: '41 إعداد عميل',
      icon: <Wrench className="w-4 h-4 text-amber-400" />,
      memory: ['Execution Checklist المعتمدة', 'Quality Review للأدوات والمجالات'],
    },
  ];

  const [selectedAgentId, setSelectedAgentId] = React.useState<string>('ceo');
  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: `أهلاً بك يا ${user?.displayName || 'عضو الفريق'}! أنا (${selectedAgent.name})، مسؤولي الاستراتيجية على النظام. كيف يمكنني مساعدتك اليوم؟`,
      timestamp: 'الآن',
      agentName: selectedAgent.name,
    },
  ]);

  const [inputQuery, setInputQuery] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsGenerating(true);

    setTimeout(() => {
      let aiText = `بواسطة (${selectedAgent.name}): تم تحليل طلبك وتطبيق قواعد المعرفة المتخصصة (${selectedAgent.role}).`;
      let generatedArtifact: UIArtifactSchema | undefined;

      if (query.includes('تقرير') || query.includes('أداء') || query.includes('مهام')) {
        aiText += ' قمت بتوليد لوحة معلومات تفاعلية محددة:';
        generatedArtifact = {
          id: `art-${Date.now()}`,
          type: 'kpi_report',
          title: `تقرير أداء المنظومة — بواسطة ${selectedAgent.name}`,
          summary: `تحليل واستشارة مستخلصة من خزانة الذاكرة (${selectedAgent.learned}).`,
          generatedAt: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          kpis: [
            { label: 'القرارات المتخذة', value: selectedAgent.learned, change: '+12% تحسن' },
            { label: 'حالة الـ Agent', value: selectedAgent.status, change: 'نشط 100%' },
            { label: 'درجة الدقة المعرفية', value: '98%', change: 'ممتاز' },
          ],
          items: selectedAgent.memory.map((mem) => ({
            title: mem,
            status: 'معتمد',
            detail: 'مصدر الذاكرة والتعليمات المستمرة',
          })),
          actions: [
            'مراجعة الأداء الأسبوعي مع فريق العمل.',
            'اعتماد التدفقات الآلية المقترحة.',
          ],
        };
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        agentName: selectedAgent.name,
        artifact: generatedArtifact,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* 11 Agents Selector Bar */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 overflow-x-auto flex items-center gap-2">
        <span className="text-xs font-bold text-slate-400 shrink-0 px-2 flex items-center gap-1">
          <Bot className="w-4 h-4 text-indigo-400" />
          اختر الـ AI Agent (11):
        </span>
        {agents.map((ag) => {
          const isSelected = ag.id === selectedAgentId;
          return (
            <button
              key={ag.id}
              onClick={() => setSelectedAgentId(ag.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {ag.icon}
              <span>{ag.name}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Agent Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {selectedAgent.icon}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white">{selectedAgent.name}</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Badge variant="success" className="text-[10px] py-0">
                {selectedAgent.status}
              </Badge>
            </div>
            <span className="text-[11px] text-slate-400">
              {selectedAgent.role} • تعلّم من {selectedAgent.learned}
            </span>
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={() => setMessages([])} className="text-xs text-slate-400">
          <RefreshCw className="w-3.5 h-3.5 me-1" />
          مسح المحادثة
        </Button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {msg.sender === 'ai' ? (
              <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0">
                {selectedAgent.icon}
              </div>
            ) : (
              <Avatar src={user?.avatarUrl} fallback={user?.displayName || 'ME'} size="sm" />
            )}

            <div className={`flex flex-col max-w-xl ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tl-none shadow-md'
                    : 'bg-slate-950/70 border border-slate-800 text-slate-200 rounded-tr-none'
                }`}
              >
                {msg.text}
              </div>

              {msg.artifact && <ArtifactRenderer schema={msg.artifact} />}

              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          </motion.div>
        ))}

        {isGenerating && (
          <div className="flex items-center gap-2 text-xs text-indigo-400 p-2">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>يقوم {selectedAgent.name} بقراءة الذاكرة وقواعد المعرفة...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <Input
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`اسأل ${selectedAgent.name} عن أي استشارة، تقرير، أو أتمتة...`}
          className="bg-slate-900 border-slate-800 text-xs"
        />
        <Button variant="primary" size="md" onClick={() => handleSend()} isLoading={isGenerating} className="px-4">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
