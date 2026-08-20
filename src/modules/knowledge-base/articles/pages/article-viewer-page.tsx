import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { KnowledgeApi } from '../../api/knowledge.api';
import { KnowledgeReviewsApi } from '../../api/reviews.api';
import { KnowledgeDocument, KnowledgeVersion } from '../../types/domain.types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ThumbsUp, ThumbsDown, BookOpen, Clock, FileText } from 'lucide-react';

export function ArticleViewerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doc, setDoc] = React.useState<KnowledgeDocument | null>(null);
  const [versions, setVersions] = React.useState<KnowledgeVersion[]>([]);
  const [selectedVersionBody, setSelectedVersionBody] = React.useState<string | null>(null);
  const [selectedVersionNum, setSelectedVersionNum] = React.useState<number | null>(null);
  const [hasVoted, setHasVoted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) return;
    Promise.all([
      KnowledgeApi.fetchById(id),
      KnowledgeReviewsApi.fetchVersions(id),
    ]).then(([d, vList]) => {
      setDoc(d);
      setVersions(vList);
      setIsLoading(false);
    });
  }, [id]);

  const handleVote = async (isHelpful: boolean) => {
    if (!doc || hasVoted) return;
    const updated = await KnowledgeApi.voteHelpful(doc.id, isHelpful);
    setDoc(updated);
    setHasVoted(true);
  };

  const handleSelectVersion = (version: KnowledgeVersion) => {
    setSelectedVersionBody(version.body);
    setSelectedVersionNum(version.versionNumber);
  };

  const resetToCurrent = () => {
    setSelectedVersionBody(null);
    setSelectedVersionNum(null);
  };

  if (isLoading) {
    return <div className="p-12 text-center text-xs text-slate-400">جاري تحميل المستند المعرفي...</div>;
  }

  if (!doc) {
    return <div className="p-12 text-center text-xs text-slate-400">المستند غير موجود.</div>;
  }

  const currentBody = selectedVersionBody || doc.body;

  return (
    <div className="flex flex-col gap-6">
      {/* Navigation */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2 font-bold">
          <span className="cursor-pointer hover:text-white" onClick={() => navigate('/knowledge')}>قاعدة المعرفة</span>
          <span>/</span>
          <span className="text-white font-extrabold truncate max-w-44">{doc.title}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/knowledge')}
          className="gap-2 border-blue-500/20 bg-slate-950/40 text-[10px]"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>العودة للمكتبة الرئيسية</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Side: Table of contents and Versioning logs history comparison */}
        <div className="lg:col-span-1 flex flex-col gap-5">
          {/* Metadata */}
          <Card className="p-4 space-y-3 text-[11px] text-slate-400">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 border-b border-slate-850 pb-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>بيانات المستند</span>
            </h4>
            <div className="flex justify-between">
              <span>النوع:</span>
              <span className="font-bold text-white">{doc.type}</span>
            </div>
            <div className="flex justify-between">
              <span>القسم:</span>
              <span className="font-bold text-white">{doc.departmentId}</span>
            </div>
            <div className="flex justify-between">
              <span>الصلاحية البصرية:</span>
              <span className="font-bold text-indigo-400">{doc.visibility}</span>
            </div>
            <div className="flex justify-between">
              <span>الإصدار الحالي:</span>
              <span className="font-bold text-cyan-400">v{doc.version}</span>
            </div>
          </Card>

          {/* Versions History */}
          <Card className="p-4 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 border-b border-slate-850 pb-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>تاريخ التعديلات والنسخ</span>
            </h4>

            <div className="space-y-2">
              <button
                onClick={resetToCurrent}
                className={`w-full text-right p-2 rounded-lg text-[10px] font-bold block cursor-pointer transition-all ${
                  selectedVersionNum === null
                    ? 'bg-indigo-600/15 border border-indigo-500/25 text-white'
                    : 'bg-slate-950/40 text-slate-400 border border-transparent hover:text-white'
                }`}
              >
                النسخة الحالية النشطة (v{doc.version})
              </button>

              {versions.map((ver) => {
                const isSelected = selectedVersionNum === ver.versionNumber;
                return (
                  <button
                    key={ver.id}
                    onClick={() => handleSelectVersion(ver)}
                    className={`w-full text-right p-2 rounded-lg text-[10px] block cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-600/15 border border-indigo-500/25 text-white'
                        : 'bg-slate-950/40 text-slate-400 border border-transparent hover:text-white'
                    }`}
                  >
                    إصدار v{ver.versionNumber} ({ver.createdAt})
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Side: Article Body content view */}
        <div className="lg:col-span-3">
          <Card className="p-6 space-y-6">
            {selectedVersionNum !== null && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-400 rounded-lg flex items-center justify-between">
                <span>⚠️ أنت الآن تعاين نسخة قديمة مؤرشفة (v{selectedVersionNum}).</span>
                <button onClick={resetToCurrent} className="font-extrabold underline cursor-pointer">
                  الرجوع للنسخة الحالية
                </button>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[9px] border-indigo-500/20 text-indigo-400 uppercase">
                  {doc.type}
                </Badge>
                <span className="text-[10px] text-slate-500">تحديث: {doc.updatedAt}</span>
              </div>
              <h1 className="text-xl font-black text-white">{doc.title}</h1>
              <p className="text-xs text-slate-400 leading-relaxed font-bold">{doc.summary}</p>
            </div>

            {/* Document Body */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-850 text-xs text-slate-200 leading-relaxed whitespace-pre-line font-mono">
              {currentBody}
            </div>

            {/* Helpfulness Feedback voting triggers */}
            <div className="pt-5 border-t border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>هل كانت هذه الإرشادات التشغيلية مفيدة لك؟</span>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVote(true)}
                  disabled={hasVoted}
                  className={`h-8 gap-1.5 border-emerald-500/20 text-emerald-400 hover:bg-emerald-950/10 ${hasVoted ? 'opacity-65' : ''}`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>نعم ({doc.feedbackScore.helpful})</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVote(false)}
                  disabled={hasVoted}
                  className={`h-8 gap-1.5 border-rose-500/20 text-rose-400 hover:bg-rose-950/10 ${hasVoted ? 'opacity-65' : ''}`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>لا ({doc.feedbackScore.unhelpful})</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default ArticleViewerPage;
