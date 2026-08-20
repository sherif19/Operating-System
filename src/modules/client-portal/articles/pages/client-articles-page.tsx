import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronDown, ChevronUp, Lock, FileText } from 'lucide-react';

interface ArticleItem {
  id: string;
  title: string;
  category: 'policy' | 'journey_guide' | 'pre_call' | 'post_call';
  readTime: string;
  isUnlocked: boolean;
  contentSummary: string;
  faqs: { q: string; a: string }[];
}

export function ClientArticlesPage() {
  const [openFaq, setOpenFaq] = React.useState<string | null>(null);

  const articles: ArticleItem[] = [
    {
      id: 'art-1',
      title: 'الشروط والإرشادات العامة لرحلة العميل بالأكاديمية',
      category: 'policy',
      readTime: '3 دقائق',
      isUnlocked: true,
      contentSummary: 'دليل شامل يشرح حقوق العميل، أوقات الاستجابة، وقواعد طلب التعديلات بعد إتمام التسليم.',
      faqs: [
        { q: 'متى يحق لي طلب تعديل على الهوية؟', a: 'خلال 7 أيام من تاريخ نشر المخرج في قسم (ممتلكاتي).' },
        { q: 'هل يمكنني تغيير الدومين بعد الشراء؟', a: 'الدومين يُسجل رسمياً باسمك فوراً ولا يمكن تعديله مجاناً عقب الشراء.' },
      ],
    },
    {
      id: 'art-2',
      title: 'إرشادات ما قبل مكالمة البداية (Kickoff Guide)',
      category: 'pre_call',
      readTime: '5 دقائق',
      isUnlocked: true,
      contentSummary: 'تجهيز أفكار مشروعك، الألوان المفضلة، وحساباتك لتوفير وقت المكالمة مع المدرب.',
      faqs: [
        { q: 'ماذا أحضر معي للمكالمة؟', a: 'رؤية مشروعك، نماذج أعجبتك، وأي حسابات ترغب في ربطها.' },
      ],
    },
    {
      id: 'art-3',
      title: 'دليل إدارة الحسابات والسوشيال ميديا عقب التسليم',
      category: 'post_call',
      readTime: '7 دقائق',
      isUnlocked: false,
      contentSummary: 'يفتح هذا المقال تلقائياً عقب إتمام مرحلة التسليم ومكالمة النهاية.',
      faqs: [],
    },
  ];

  const categoryLabels: Record<ArticleItem['category'], string> = {
    policy: 'الشروط والسياسات',
    journey_guide: 'دليل الرحلة',
    pre_call: 'قبل المكالمة',
    post_call: 'بعد المكالمة',
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex flex-col gap-1">
          <Badge variant="purple" className="w-fit">
            <BookOpen className="w-3.5 h-3.5 me-1" />
            المقالات والأدلة الإرشادية التفاعلية
          </Badge>
          <h1 className="text-2xl font-bold text-white">مركز المعرفة والسياسات الداخلية</h1>
          <p className="text-xs text-slate-400">
            مقالات ويب تفاعلية مجهزة خصيصاً داخل المنصة بدون حاجة لفتح روابط خارجية أو ملفات PDF.
          </p>
        </div>
      </div>

      {/* Articles Stream */}
      <div className="space-y-4">
        {articles.map((art) => (
          <Card
            key={art.id}
            className={`transition-all ${
              art.isUnlocked ? 'hover:border-indigo-500/40' : 'opacity-60 bg-slate-950/40 border-slate-800/40'
            }`}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl mt-1 shrink-0 ${art.isUnlocked ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                    {art.isUnlocked ? <FileText className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-white">{art.title}</h3>
                      <Badge variant="default" className="text-[10px]">
                        {categoryLabels[art.category]}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{art.contentSummary}</p>
                    <span className="text-[10px] text-slate-400 mt-1">مدة القراءة: {art.readTime}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {art.isUnlocked ? (
                    <Button variant="primary" size="sm">
                      قراءة المقال الآن
                    </Button>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">
                      سيفتح لاحقاً
                    </Badge>
                  )}
                </div>
              </div>

              {/* FAQs Accordion if any */}
              {art.faqs.length > 0 && art.isUnlocked && (
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 mb-2">الأسئلة المتكررة الشائعة:</h4>
                  {art.faqs.map((faq, idx) => {
                    const faqKey = `${art.id}-${idx}`;
                    const isOpen = openFaq === faqKey;
                    return (
                      <div key={idx} className="rounded-xl bg-slate-950/60 border border-slate-800/80 overflow-hidden text-xs">
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : faqKey)}
                          className="w-full p-3 text-right flex items-center justify-between font-semibold text-slate-200 hover:text-white"
                        >
                          <span>{faq.q}</span>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </button>
                        {isOpen && (
                          <div className="p-3 pt-0 text-slate-400 border-t border-slate-800/50 bg-slate-900/40 leading-relaxed">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
