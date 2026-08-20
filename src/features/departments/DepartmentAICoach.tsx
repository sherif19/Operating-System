import React from 'react';
import { DepartmentOSService } from './services/departments.service';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, Sparkles, Send, User, Lightbulb } from 'lucide-react';

export function DepartmentAICoach() {
  const summary = DepartmentOSService.getSummary();
  const [messages, setMessages] = React.useState([
    {
      id: '1',
      sender: 'AI_COACH',
      text: `أهلاً بك يا ${summary.managerName}! أنا مستشار الذكاء الاصطناعي الخاص بـ (${summary.name}). لقد قمت بمراجعة بيانات الأسبوع الحالية: مؤشر سرعة التنفيذ بلغت ${summary.executionSpeedPercentage}% مع وجود ${summary.openTasksCount} مهمة نشطة. كيف يمكنني مساعدتك في تطوير الأداء اليوم؟`,
      time: 'الآن',
    },
  ]);

  const [inputMsg, setInputMsg] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);

  const quickPrompts = [
    'كيف يمكننا رفع سرعة التنفيذ وتقليل زمن المعالجة الفعّال؟',
    'تحليل ثغرات الـ SLA ومواضع التأخير للأسبوع الحالي',
    'توصيات لزيادة دافعية وكفاءة فريق العمل',
    'صياغة خطة توجيه تدريبية (Coaching Plan) لربط الدومينات',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputMsg;
    if (!query.trim()) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'USER',
      text: query,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMsg('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = `بناءً على الأدلة الإجرائية المعيارية (SOPs) وسجل أداء القسم: يُنصح بالتركيز على إزالة التداخل في المهام المركبة وتأكيد تفعيل الـ Webhooks آلياً فور الاعتماد. تظهر البيانات أن استبعاد وقت الانتظار قبل القبول رفع دقة التقييم بنسبة 12%.`;
      if (query.includes('سرعة')) {
        replyText = `لرفع سرعة التنفيذ: يُنصح بتطبيق نموذج التكليف الفوري لأول موظف متوافر في الوردية النشطة، مع استخدام قوالب المهام الجاهزة وتدريب الفريق على معايير SOP 1 المرتبطة بالسيرفرات.`;
      } else if (query.includes('دافعية') || query.includes('توجيه')) {
        replyText = `توصية التوجيه الداخلي: يُوصى بعمل جلسة كوتشينج فردية مدتها 15 دقيقة مع الموظف لتوضيح الهدف وتوفير الدعم التقني دون أي عقوبات، مما يرفع الالتزام بنسبة 25%.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'AI_COACH',
          text: replyText,
          time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 text-right">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-[10px]">
              <Sparkles className="w-3.5 h-3.5 me-1 animate-pulse text-cyan-300" />
              AI Department Coach — مستشار الذكاء الاصطناعي للقسم
            </Badge>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">مستشار الذكاء الاصطناعي والتحليل التنبؤي</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            مساعد ذكي محضر مسبقاً ببيانات وأدلة القسم (SOPs) لتقديم استشارات فورية وتحليل الأداء.
          </p>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickPrompts.map((prompt, pIdx) => (
          <button
            key={pIdx}
            onClick={() => handleSend(prompt)}
            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-right text-xs text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-between group shadow-md"
          >
            <span className="leading-snug text-[11px] font-bold">{prompt}</span>
            <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 ms-2 group-hover:scale-110 transition-transform" />
          </button>
        ))}
      </div>

      {/* Main Chat Interface */}
      <Card className="p-6 bg-slate-900/90 border-slate-800 shadow-2xl flex flex-col justify-between min-h-[500px]">
        {/* Messages Stream */}
        <div className="space-y-4 overflow-y-auto max-h-[420px] p-2">
          {messages.map((msg) => {
            const isAI = msg.sender === 'AI_COACH';
            return (
              <div key={msg.id} className={`flex gap-3 items-start ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    isAI
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30'
                  }`}
                >
                  {isAI ? <Bot className="w-5 h-5 text-indigo-400" /> : <User className="w-5 h-5 text-cyan-400" />}
                </div>

                <div className={`p-4 rounded-3xl text-xs leading-relaxed max-w-xl ${
                  isAI
                    ? 'bg-slate-950 border border-slate-850 text-slate-100 rounded-tr-none shadow-lg'
                    : 'bg-indigo-600 text-white rounded-tl-none font-medium'
                }`}>
                  <div className="flex items-center justify-between text-[9px] text-slate-400 mb-1">
                    <span className="font-bold text-slate-300">{isAI ? 'مستشار AI للقسم' : 'أنت (مدير القسم)'}</span>
                    <span className="font-mono">{msg.time}</span>
                  </div>
                  <p>{msg.text}</p>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 p-2">
              <Bot className="w-4 h-4 animate-spin" />
              <span>مستشار AI يفكر ويحلل بيانات القسم...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="flex gap-2 pt-4 border-t border-slate-800 items-center mt-4">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder="اسأل مستشار AI عن أي تحليل، توصية، أو خطة عمل للقسم..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <Button onClick={() => handleSend()} className="h-11 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-2xl">
            <Send className="w-4 h-4 me-1" />
            إرسال
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default DepartmentAICoach;
