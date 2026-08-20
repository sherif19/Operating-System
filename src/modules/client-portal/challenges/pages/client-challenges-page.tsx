import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Award, ExternalLink, Trophy, Star } from 'lucide-react';

export function ClientChallengesPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Facebook Group Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-600 text-white shrink-0 mt-1 shadow-lg shadow-blue-600/30">
            <Users className="w-7 h-7" />
          </div>
          <div className="flex flex-col gap-1">
            <Badge variant="default" className="w-fit bg-blue-500/20 text-blue-300">
              مجتمع الأكاديمية الخاص
            </Badge>
            <h1 className="text-2xl font-extrabold text-white">انضم لمجموعة فيسبوك النخبة</h1>
            <p className="text-xs text-slate-300">
              مساحة خاصة لتبادل الخبرات، والتواصل مع رواد الأعمال، وحضور اللقاءات المباشرة.
            </p>
          </div>
        </div>

        <a href="https://facebook.com/groups/academy-community" target="_blank" rel="noreferrer">
          <Button variant="primary" size="md" className="bg-blue-600 hover:bg-blue-500 gap-2">
            <ExternalLink className="w-4 h-4" />
            <span>الانضمام للمجموعة الآن</span>
          </Button>
        </a>
      </div>

      {/* Optional Challenges Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>تحديات اختيارية لتسريع نجاح مشروعك</span>
        </h3>
        <p className="text-xs text-slate-400">أنشطة اختيارية يمكنك إنجازها أثناء الفترات التشغيلية البينية لزيادة النمو.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <Card className="hover:border-indigo-500/40 transition-all">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                تحدي إعداد أول 5 منشورات تسويقية
              </CardTitle>
              <Badge variant="amber" className="text-[10px]">تحدي أسبوعي</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                تجهيز خطة محتوى أولية لنشرها فور استلام حسابات التواصل الاجتماعي المعتمدة.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                البدء في التحدي
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-indigo-500/40 transition-all">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                تحدي دراسة المنافسين الخمسة
              </CardTitle>
              <Badge variant="purple" className="text-[10px]">تحدي تحليلي</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                تحديد نقاط القوة والضعف لدى أبرز المنافسين في مجالك لتقديم مزايا تنافسية حقيقية.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                البدء في التحدي
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
