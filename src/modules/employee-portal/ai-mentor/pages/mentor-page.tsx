import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Bot, Send, User } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export function MentorPage() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'أهلاً بك يا عمر! أنا الـ AI Mentor الخاص بك في Company OS. قمت بفحص جدولك والمهام النشطة لديك لليوم. كيف يمكنني مساعدتك في تسريع تنفيذ مشروعك أو فهم دليل الـ SOP؟',
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = React.useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Simulated context response based on keywords
    setTimeout(() => {
      let replyText = 'عذراً عمر، لم أفهم استفسارك تماماً. يمكنك سؤالي عن "دليل الهوية البصرية"، "ترتيب مهام اليوم"، أو "تحسين الأداء".';

      const lowerText = inputText.toLowerCase();
      if (lowerText.includes('دليل الهوية') || lowerText.includes('لوجو')) {
        replyText = 'دليل SOP-04 يوضح الخطوات التالية لتسليم الهوية:\n1. تأكد من تفعيل ألوان الـ RGB والـ CMYK.\n2. احفظ الملفات بصيغة SVG/PNG عالية الجودة.\n3. ارفعها عبر تبويب المخرجات بترميز مسمى (identity-sara).';
      } else if (lowerText.includes('اليوم') || lowerText.includes('ترتيب')) {
        replyText = 'لديك ٣ مهام رئيسية اليوم. الموعد الحرج هو الساعة 4:00 عصراً لتسليم تصاميم السوشيال ميديا. أنصحك بإنهاء دليل الهوية أولاً ثم أخذ استراحة قصيرة.';
      } else if (lowerText.includes('أداء') || lowerText.includes('أدائي')) {
        replyText = 'أداؤك ممتاز ومعدل الالتزام بالـ SLA لديك 94%. متوسط الانحراف الزمني هو 12 دقيقة تأخر. أنصحك بالتركيز على إعداد ملفات الاستضافة أسرع لتقليص الانحراف لصفر.';
      }

      const botMsg: ChatMessage = {
        sender: 'bot',
        text: replyText,
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col gap-1">
          <Badge variant="default" className="w-fit bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-extrabold px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 me-1.5 animate-pulse" />
            AI Mentor Workspace
          </Badge>
          <h1 className="text-2xl font-black text-white">مرشدك الذكي الشخصي لتطوير الإنتاجية</h1>
          <p className="text-xs text-slate-400">
            تحدث مع الذكاء الاصطناعي للحصول على تفاصيل المهام، خطوات الأدلة الإرشادية SOPs، وتفاصيل أداء العمل اليومي.
          </p>
        </div>
      </div>

      {/* Chat workspace */}
      <Card className="p-5 flex flex-col justify-between h-[450px] relative overflow-hidden bg-slate-950/80 border-slate-900">
        <div className="absolute -left-20 -top-20 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Message logs */}
        <div className="flex-1 overflow-y-auto space-y-4 p-1 pr-2 no-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className="flex gap-2.5 items-start">
              <div className={`p-1.5 rounded-lg shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white border border-slate-850'
                  : 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 animate-pulse" />}
              </div>

              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 text-[9px] text-slate-500">
                  <span className="font-bold">{msg.sender === 'user' ? 'عمر مصطفى' : 'AI Mentor'}</span>
                  <span>{msg.time}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-850 text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Composer */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-850">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اسأل الكوتش عن الأدلة، مهام اليوم، أو تتبع الأداء..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder:text-slate-500"
          />
          <Button variant="primary" size="md" onClick={handleSend} className="h-10 py-1 px-4">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
export default MentorPage;
