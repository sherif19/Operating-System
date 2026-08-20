import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CustomersApi } from '../../../customers/api/customers.api';
import { CustomerTasksApi } from '../../../customers/tasks/api/customer-tasks.api';
import { Customer, CustomerTask } from '../../../customers/types/domain.types';
import { FirebaseStorageService } from '@/lib/firebase/storage.service';
import { useAuthStore } from '@/stores/auth.store';
import {
  Sparkles,
  Clipboard,
  AlertTriangle,
  CheckCircle2,
  ArrowDown,
  Upload,
  MessageSquare,
  Send,
  FileText,
  Image as ImageIcon,
  Loader2,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export function CustomerListPage() {
  const { user } = useAuthStore();
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string | null>(null);
  const [tasks, setTasks] = React.useState<CustomerTask[]>([]);
  const [notes, setNotes] = React.useState<Record<string, string[]>>({});
  const [newNoteText, setNewNoteText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isTasksLoading, setIsTasksLoading] = React.useState(false);
  const [uploadingTaskId, setUploadingTaskId] = React.useState<string | null>(null);

  // New Comment state per task
  const [commentInputs, setCommentInputs] = React.useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = React.useState<Record<string, boolean>>({});

  // Fetch assigned customers
  React.useEffect(() => {
    CustomersApi.fetchAll().then((data) => {
      // Omar is emp-1. Filter clients assigned to him or show all for demo
      const assigned = data.filter((c) => c.assignedTrainerId === 'Omar' || true);
      setCustomers(assigned);
      setIsLoading(false);

      if (assigned.length > 0) {
        setSelectedCustomerId(assigned[0].id);
      }
    });
  }, []);

  // Fetch tasks when selected customer changes
  const loadCustomerTasks = React.useCallback(async (custId: string) => {
    setIsTasksLoading(true);
    try {
      const fetchedTasks = await CustomerTasksApi.fetchByCustomer(custId);
      setTasks(fetchedTasks);
    } catch (e) {
      console.error('Failed to fetch customer tasks', e);
    } finally {
      setIsTasksLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (selectedCustomerId) {
      loadCustomerTasks(selectedCustomerId);
    }
  }, [selectedCustomerId, loadCustomerTasks]);

  const activeCustomer = customers.find((c) => c.id === selectedCustomerId);

  // 1. Toggle task completion status
  const handleToggleTaskStatus = async (task: CustomerTask) => {
    const nextStatus = task.status === 'completed' ? 'in_progress' : 'completed';
    try {
      const updated = await CustomerTasksApi.updateTaskStatus(task.id, nextStatus);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));

      // Recalculate customer progress
      const updatedTasks = tasks.map((t) => (t.id === task.id ? updated : t));
      const completedCount = updatedTasks.filter((t) => t.status === 'completed').length;
      const newProgress = Math.round((completedCount / updatedTasks.length) * 100);

      if (activeCustomer) {
        activeCustomer.progress = newProgress;
      }
    } catch (e) {
      console.error('Failed to toggle task status', e);
    }
  };

  // 2. Upload proof media for a task
  const handleUploadProofMedia = async (taskId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCustomerId) return;

    try {
      setUploadingTaskId(taskId);
      const mediaUrl = await FirebaseStorageService.uploadChatFile(
        `task_proofs_${selectedCustomerId}`,
        file,
        file.name
      );

      if (mediaUrl) {
        const updated = await CustomerTasksApi.addProofMedia(taskId, mediaUrl);
        setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      }
    } catch (err) {
      console.error('Failed to upload proof media', err);
    } finally {
      setUploadingTaskId(null);
    }
  };

  // 3. Add comment to a task
  const handleAddComment = async (taskId: string) => {
    const text = commentInputs[taskId]?.trim();
    if (!text) return;

    const authorName = user?.displayName || 'يوسف الشريف (منفذ)';

    try {
      const updated = await CustomerTasksApi.addComment(taskId, authorName, text);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      setCommentInputs((prev) => ({ ...prev, [taskId]: '' }));
    } catch (e) {
      console.error('Failed to add task comment', e);
    }
  };

  // Add coaching note
  const handleAddNote = () => {
    if (!selectedCustomerId || !newNoteText.trim()) return;
    setNotes((prev) => ({
      ...prev,
      [selectedCustomerId]: [...(prev[selectedCustomerId] || []), newNoteText],
    }));
    setNewNoteText('');
  };

  const toggleCommentsExpand = (taskId: string) => {
    setExpandedComments((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  return (
    <div className="flex flex-col gap-6 text-right">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col gap-1">
          <Badge variant="default" className="w-fit bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-extrabold px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 me-1.5 animate-pulse" />
            My Customers — مسارات العملاء الموكلين
          </Badge>
          <h1 className="text-2xl font-black text-white">إدارة رحلات وتدفق مهام العملاء الموكلين إليّ</h1>
          <p className="text-xs text-slate-400">
            تابع تسلسل تنفيذ مهام العميل المربوطة بأسهم، وعيّن المهام المكتملة، وارفَق ميديا التأكيد والتدوينات.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Right Side Directory: Client cards list */}
        <div className="w-full lg:w-80 flex flex-col gap-3 shrink-0">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            عملائي الموكلين ({customers.length})
          </span>

          {isLoading ? (
            <div className="text-center text-xs text-slate-500 py-8">جاري تحميل قائمة العملاء...</div>
          ) : customers.length > 0 ? (
            customers.map((c) => {
              const isSelected = selectedCustomerId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCustomerId(c.id)}
                  className={`w-full text-right p-4 rounded-2xl border transition-all cursor-pointer block relative overflow-hidden ${
                    isSelected
                      ? 'bg-slate-800 border-indigo-500/50 text-white shadow-xl shadow-indigo-500/10'
                      : 'bg-slate-950/40 text-slate-400 border-slate-900 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-1 h-full bg-indigo-500" />
                  )}
                  <div className="font-extrabold text-xs text-slate-100">{c.name}</div>
                  <div className="text-[10px] opacity-75 mt-0.5 font-mono text-slate-400">{c.companyName}</div>
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800 text-[9px] text-slate-400">
                    <span>المرحلة: <strong className="text-slate-200">{c.currentStage}</strong></span>
                    <span className="font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                      {c.progress}%
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center text-xs text-slate-500 py-8">لا يوجد عملاء مسندين لك حالياً.</div>
          )}
        </div>

        {/* Left Side: Tasks Workflow Diagram (المخطط الهيكلي المربوط بأسهم) */}
        <div className="flex-1 w-full min-w-0 space-y-6">
          {activeCustomer ? (
            <>
              {/* Active Customer Overview Header */}
              <Card className="p-5 border-slate-800 bg-slate-900/80">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-black text-indigo-400 text-sm">
                      {activeCustomer.name[0]}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white">{activeCustomer.name}</h3>
                      <span className="text-[11px] text-slate-400 font-mono">{activeCustomer.companyName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <span className="text-[10px] text-slate-500 block font-bold">نسبة إنجاز الرحلة</span>
                      <span className="text-xs font-black text-cyan-400">{activeCustomer.progress}%</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-2.5 py-1 ${
                        activeCustomer.health === 'healthy'
                          ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                          : 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                      }`}
                    >
                      {activeCustomer.health.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Flowchart Progress Bar */}
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${activeCustomer.progress}%` }}
                  />
                </div>
              </Card>

              {/* Sequential Task Flowchart Graph (سلسلة المهام المربوطة بأسهم) */}
              <Card className="p-6 border-slate-800 bg-slate-900/90 shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span>مسار وسلسلة تنفيذ المهام (مربوطة بأسهم متتابعة)</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1">
                      الخطوات المتتابعة للعميل؛ قم بتحديد المهمة كـ "اكتملت"، رفع ميديا التأكيد، أو إضافة تعليقات.
                    </p>
                  </div>
                  <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 text-xs">
                    {tasks.length} مهام في المسار
                  </Badge>
                </div>

                {isTasksLoading ? (
                  <div className="text-center py-12 text-xs text-slate-500 flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                    <span>جاري تحميل مخطط المهام...</span>
                  </div>
                ) : tasks.length > 0 ? (
                  <div className="relative space-y-6">
                    {tasks.map((task, idx) => {
                      const isCompleted = task.status === 'completed';
                      const isInProgress = task.status === 'in_progress';
                      const isNext = idx < tasks.length - 1;

                      return (
                        <React.Fragment key={task.id}>
                          {/* Task Node Card */}
                          <div
                            className={`p-5 rounded-2xl border transition-all relative ${
                              isCompleted
                                ? 'bg-slate-950/70 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                                : isInProgress
                                ? 'bg-slate-950/90 border-indigo-500/60 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/20'
                                : 'bg-slate-950/30 border-slate-800/80 text-slate-400'
                            }`}
                          >
                            {/* Task Top Bar */}
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex items-center gap-3">
                                {/* Task Status Icon Node */}
                                <div
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                                    isCompleted
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                      : isInProgress
                                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 animate-pulse'
                                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                                  }`}
                                >
                                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                                </div>

                                <div>
                                  <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
                                    <span>{task.title}</span>
                                    {isCompleted && (
                                      <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px]">
                                        مكتملة ✅
                                      </Badge>
                                    )}
                                    {isInProgress && (
                                      <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-[9px]">
                                        جاري التنفيذ ⏳
                                      </Badge>
                                    )}
                                  </h4>
                                  <span className="text-[10px] text-slate-500 block mt-0.5">
                                    مرحلة: <strong className="text-slate-400">{task.stage}</strong> | الاستحقاق: {task.dueDate}
                                  </span>
                                </div>
                              </div>

                              {/* Action: Toggle Task Completion */}
                              <Button
                                size="sm"
                                variant={isCompleted ? 'outline' : 'primary'}
                                onClick={() => handleToggleTaskStatus(task)}
                                className={`h-8 text-xs font-bold gap-1.5 transition-all cursor-pointer ${
                                  isCompleted
                                    ? 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10'
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{isCompleted ? 'إلغاء الإتمام' : 'تعيين كـ مكتملة ✅'}</span>
                              </Button>
                            </div>

                            {/* Description */}
                            {task.description && (
                              <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-850/60 leading-relaxed mb-4">
                                {task.description}
                              </p>
                            )}

                            {/* Media Proof Section (ميديا تأكيد الإنجاز) */}
                            <div className="pt-3 border-t border-slate-850/80 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                                  <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>ميديا وصور تأكيد الإنجاز ({task.proofMedia?.length || 0})</span>
                                </span>

                                {/* Upload Proof Media Button */}
                                <label className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg cursor-pointer">
                                  {uploadingTaskId === task.id ? (
                                    <>
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                      <span>جاري الرفع...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="w-3 h-3" />
                                      <span>📸 رفع ميديا تأكيد</span>
                                    </>
                                  )}
                                  <input
                                    type="file"
                                    accept="image/*,.pdf,.doc,.docx"
                                    onChange={(e) => handleUploadProofMedia(task.id, e)}
                                    disabled={uploadingTaskId === task.id}
                                    className="hidden"
                                  />
                                </label>
                              </div>

                              {/* Proof Media Gallery Grid */}
                              {task.proofMedia && task.proofMedia.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                  {task.proofMedia.map((url, mediaIdx) => (
                                    <a
                                      key={mediaIdx}
                                      href={url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="w-16 h-16 rounded-xl border border-slate-800 overflow-hidden bg-slate-900 relative group shrink-0"
                                    >
                                      {url.match(/\.(jpeg|jpg|gif|png|webp)/i) || url.startsWith('data:image') ? (
                                        <img src={url} alt="Proof" className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-indigo-400 p-1">
                                          <FileText className="w-5 h-5" />
                                          <span className="text-[8px] mt-0.5">مستند</span>
                                        </div>
                                      )}
                                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                        <ExternalLink className="w-4 h-4" />
                                      </div>
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Task Comments Section (تعليقات المهمة) */}
                            <div className="pt-3 border-t border-slate-850/80 mt-3 space-y-3">
                              <button
                                onClick={() => toggleCommentsExpand(task.id)}
                                className="text-[10px] font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                                <span>التعليقات والتدوينات ({task.comments?.length || 0})</span>
                                {expandedComments[task.id] ? (
                                  <ChevronUp className="w-3 h-3 text-slate-500" />
                                ) : (
                                  <ChevronDown className="w-3 h-3 text-slate-500" />
                                )}
                              </button>

                              {(expandedComments[task.id] || (task.comments && task.comments.length > 0)) && (
                                <div className="space-y-2">
                                  {/* Previous Comments List */}
                                  {task.comments && task.comments.length > 0 && (
                                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                      {task.comments.map((cmt) => (
                                        <div
                                          key={cmt.id}
                                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                                        >
                                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                                            <span className="font-bold text-indigo-400">{cmt.authorName}</span>
                                            <span className="font-mono text-slate-500">{cmt.createdAt}</span>
                                          </div>
                                          <p className="text-[11px] leading-relaxed text-slate-300">{cmt.text}</p>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Add Comment Input */}
                                  <div className="flex items-center gap-2 pt-1">
                                    <input
                                      type="text"
                                      value={commentInputs[task.id] || ''}
                                      onChange={(e) =>
                                        setCommentInputs((prev) => ({ ...prev, [task.id]: e.target.value }))
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleAddComment(task.id);
                                      }}
                                      placeholder="اكتب تعليقاً أو ملحوظة على هذه المهمة..."
                                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => handleAddComment(task.id)}
                                      className="h-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3"
                                    >
                                      <Send className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Connecting Directional Arrow to Next Task (السهم المتتابع المربوط) */}
                          {isNext && (
                            <div className="flex flex-col items-center justify-center py-1">
                              <div
                                className={`w-0.5 h-5 transition-colors ${
                                  isCompleted ? 'bg-emerald-500' : 'bg-indigo-500/40'
                                }`}
                              />
                              <div
                                className={`p-1.5 rounded-full border shadow-md transition-colors ${
                                  isCompleted
                                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                    : 'bg-slate-900 border-indigo-500/40 text-indigo-400'
                                }`}
                              >
                                <ArrowDown className="w-4 h-4 animate-bounce" />
                              </div>
                              <div
                                className={`w-0.5 h-5 transition-colors ${
                                  isCompleted ? 'bg-emerald-500' : 'bg-indigo-500/40'
                                }`}
                              />
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                    لا توجد مهام مسجلة لهذا العميل في الوقت الحالي.
                  </div>
                )}
              </Card>

              {/* Private Coaching Notes block */}
              <Card className="p-5 border-slate-800 bg-slate-900/80 space-y-4">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Clipboard className="w-4 h-4 text-indigo-400" />
                  <span>ملاحظاتي الخاصة وتدوينات الكوتشينج (سرية)</span>
                </h4>
                <p className="text-[10px] text-slate-500 bg-slate-950/60 p-3 rounded-lg border border-slate-800 leading-relaxed flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>هذه الملاحظات مخصصة لمشرفي النظام ومسؤولي التوجيه فقط، وهي **محجوبة تماماً عن بوابة العميل**.</span>
                </p>

                {/* Notes log timeline */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {notes[activeCustomer.id] && notes[activeCustomer.id].length > 0 ? (
                    notes[activeCustomer.id].map((note, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed"
                      >
                        {note}
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                      لا توجد ملاحظات سرية مدونة بعد.
                    </div>
                  )}
                </div>

                {/* Add note composer */}
                <div className="flex gap-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="اكتب ملاحظة توجيهية سرية جديدة..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white placeholder:text-slate-500"
                  />
                  <Button variant="outline" size="sm" onClick={handleAddNote} className="h-9">
                    حفظ الملاحظة
                  </Button>
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-12 text-center text-xs text-slate-500 border-slate-800">
              يرجى اختيار أحد العملاء من القائمة المقابلة لعرض مخطط المسار والمهام.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerListPage;
