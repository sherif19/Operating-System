import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { KnowledgeApi } from '../../api/knowledge.api';
import { KnowledgeSearchApi } from '../../api/search.api';
import { KnowledgeDocument, KnowledgeGapLog } from '../../types/domain.types';
import { Search, Sparkles, BookOpen, AlertTriangle, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export function KBDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [documents, setDocuments] = React.useState<KnowledgeDocument[]>([]);
  const [searchResults, setSearchResults] = React.useState<KnowledgeDocument[] | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [gaps, setGaps] = React.useState<KnowledgeGapLog[]>([]);
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      KnowledgeApi.fetchAll(),
      KnowledgeSearchApi.fetchGaps(),
    ]).then(([docs, gapLogs]) => {
      setDocuments(docs);
      setGaps(gapLogs);
      setIsLoading(false);
    });
  }, []);

  const handleSearch = async (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults(null);
      return;
    }
    const results = await KnowledgeSearchApi.search(val);
    setSearchResults(results);
  };

  const displayedDocs = searchResults || documents;
  const filteredDocs = activeCategory === 'all'
    ? displayedDocs
    : displayedDocs.filter((d) => d.category === activeCategory);

  const categories = ['all', ...Array.from(new Set(documents.map((d) => d.category)))];

  const isManager = user?.role === 'owner' || user?.role === 'admin' || user?.role === 'manager';

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col gap-1 z-10">
          <Badge variant="default" className="w-fit bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-extrabold px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 me-1.5 animate-pulse" />
            الذاكرة التشغيلية المشتركة — Operational Memory
          </Badge>
          <h1 className="text-2xl font-black text-white">قاعدة المعرفة والأدلة SOPs</h1>
          <p className="text-xs text-slate-400">
            البحث في إجراءات الأقسام، سياسات العمل، وأدلة التدريب والقرارات التوجيهية للشركة.
          </p>
        </div>
      </div>

      {/* Main Search Block */}
      <Card className="p-6 relative overflow-hidden bg-slate-950/80 border-slate-900">
        <div className="absolute -right-20 -top-20 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto flex flex-col gap-4 text-center py-4">
          <h2 className="text-sm font-extrabold text-white">كيف يمكنني مساعدتك اليوم في تصفح الأدلة؟</h2>
          <div className="relative">
            <Search className="w-4.5 h-4.5 text-slate-500 absolute right-3 top-3.5" />
            <Input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="ابحث دلالياً: 'refund'، 'تصميم'، 'دليل مكالمة الانطلاق'..."
              className="bg-slate-900 border-slate-800 pr-10 text-xs h-11 focus-visible:ring-1 focus-visible:ring-blue-500 text-white"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'الكل' : cat}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Doc Grid */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            المستندات وأدلة العمل ({filteredDocs.length})
          </h3>

          {isLoading ? (
            <div className="text-center text-xs text-indigo-400 p-8">جاري تحميل المعرفة...</div>
          ) : filteredDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDocs.map((doc, idx) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => navigate(`/knowledge/articles/${doc.id}`)}
                  className="card p-4 flex flex-col justify-between min-h-40 cursor-pointer border border-blue-500/10 hover:border-cyan-500/30"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[9px] border-slate-800 text-slate-400">
                        {doc.type}
                      </Badge>
                      <span className="text-[9px] text-slate-500">{doc.category}</span>
                    </div>

                    <h4 className="text-xs font-black text-slate-200 mt-2.5 line-clamp-1">
                      {doc.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                      {doc.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-slate-500 pt-3 border-t border-slate-850 mt-3">
                    <span>مراجعة: {doc.reviewDate || 'بلا'}</span>
                    <span className="text-indigo-400 font-bold flex items-center gap-0.5">
                      <span>فتح المستند</span>
                      <ArrowLeft className="w-3 h-3" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-dashed border-slate-850">
              {searchQuery ? (
                <div className="space-y-3">
                  <p>لم نجد أية نتائج مطابقة لبحثك.</p>
                  {isManager && (
                    <Button variant="primary" size="sm" className="text-[9px] h-8 font-bold">
                      إنشاء مسودة SOP مقترحة بواسطة AI
                    </Button>
                  )}
                </div>
              ) : (
                'لا توجد مستندات في هذا التصنيف حالياً.'
              )}
            </div>
          )}
        </div>

        {/* Right column: Content Gaps tracker for Managers */}
        <div className="flex flex-col gap-6">
          {isManager && gaps.length > 0 && (
            <Card className="p-4 border-amber-500/20 bg-amber-950/5">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 border-b border-slate-850 pb-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>فجوات معرفية مرصودة (Knowledge Gaps)</span>
              </h4>
              <p className="text-[9px] text-slate-400 leading-relaxed mb-3">
                عبارات بحث متكررة من الموظفين لم تجد لها أية أدلة موثقة:
              </p>
              <div className="space-y-2">
                {gaps.map((gap, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-850 flex items-center justify-between text-[10px] text-slate-300"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-extrabold truncate max-w-32">"{gap.query}"</span>
                      <span className="text-[8px] text-slate-500">تكرار البحث: {gap.searchCount} مرات</span>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-[8px] border-amber-500/20 text-amber-400">
                      توليد مسودة
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* AI Advisor widget */}
          <Card className="p-5 bg-gradient-to-br from-[#10193E] to-slate-950 border-indigo-500/20">
            <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 border-b border-slate-850 pb-2 mb-3">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>مستشار الذاكرة التوجيهي</span>
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              هذه المعرفة المركزية يتم جلبها تلقائياً للـ AI Mentor كمرجع أساسي عند توجيه الموظفين، لمنع الـ AI من ابتكار أو تخمين خطوات عمل مخالفة لسياسة الشركة الرسمية.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default KBDashboardPage;
