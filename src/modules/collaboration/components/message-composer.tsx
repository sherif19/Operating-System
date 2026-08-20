import React from 'react';
import { Mic, Send, Plus, Trash2 } from 'lucide-react';
import { MessageFile } from '../types/domain.types';

interface MessageComposerProps {
  onSend: (text: string, voiceUrl?: string, file?: MessageFile, voiceDuration?: string) => void;
}

export function MessageComposer({ onSend }: MessageComposerProps) {
  const [text, setText] = React.useState('');
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordingTime, setRecordingTime] = React.useState(0);
  const [recordingError, setRecordingError] = React.useState<string | null>(null);

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Clean up media streams and timers on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleSendText = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  // Start real Audio Recording via MediaRecorder API
  const startRecording = async () => {
    try {
      setRecordingError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access error:', err);
      setRecordingError('❌ تعذر الاتصال بالميكروفون، يرجى التأكد من سماح المتصفح بالوصول.');
      setTimeout(() => setRecordingError(null), 4000);
    }
  };

  // Stop recording and send audio message
  const stopAndSendRecording = () => {
    if (!mediaRecorderRef.current) return;

    const finalDuration = recordingTime;

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64AudioUrl = reader.result as string;
        const minutes = Math.floor(finalDuration / 60);
        const seconds = finalDuration % 60;
        const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        onSend('🎙️ رسالة صوتية', base64AudioUrl, undefined, formattedDuration);
      };

      reader.readAsDataURL(audioBlob);

      // Stop tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };

    mediaRecorderRef.current.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setRecordingTime(0);
  };

  // Cancel recording without sending
  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setRecordingTime(0);
  };

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Helper for formatting file size
    const formatBytes = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    let fileCategory: MessageFile['type'] = 'file';
    if (file.type.startsWith('image/')) fileCategory = 'image';
    else if (file.type === 'application/pdf') fileCategory = 'pdf';
    else if (file.type.startsWith('audio/')) fileCategory = 'audio';
    else if (file.type.startsWith('video/')) fileCategory = 'video';
    else if (file.type.includes('zip') || file.type.includes('rar') || file.type.includes('tar')) fileCategory = 'archive';
    else if (file.type.includes('word') || file.type.includes('document') || file.type.includes('sheet') || file.type.includes('excel')) fileCategory = 'document';

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const fileData: MessageFile = {
        name: file.name,
        size: formatBytes(file.size),
        url: dataUrl,
        type: fileCategory,
      };

      onSend(`📎 ملف مرفق: ${file.name}`, undefined, fileData);
    };

    reader.readAsDataURL(file);

    // Reset file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="p-3.5 border-t border-[#222e35]/30 bg-[#202c33] flex flex-col gap-2 relative shrink-0">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Recording Error Notification */}
      {recordingError && (
        <div className="absolute top-[-36px] right-4 left-4 bg-rose-500/90 text-white text-[10px] p-2 rounded-lg font-bold shadow-lg z-30 animate-in fade-in">
          {recordingError}
        </div>
      )}

      {/* Live Audio Recording Overlay Bar */}
      {isRecording && (
        <div className="absolute inset-0 bg-[#111b21] flex items-center justify-between px-5 text-xs text-rose-400 z-20 animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
            </span>
            <span className="font-mono text-xs text-[#e9edef] font-bold">
              {formatTimer(recordingTime)}
            </span>
            <span className="text-[11px] text-slate-400">جاري تسجيل الصوت الحي...</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={cancelRecording}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#202c33] transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
              title="إلغاء التسجيل"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">إلغاء</span>
            </button>

            <button
              onClick={stopAndSendRecording}
              className="px-3.5 py-1.5 rounded-xl bg-[#00a884] hover:bg-[#008f72] text-[#111b21] font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>إرسال الصوت</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Left Actions: Plus Attachment and Emoji */}
        <div className="flex items-center gap-2 text-[#aebac1]">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded-lg hover:text-white hover:bg-[#2a3942] cursor-pointer transition-colors"
            title="إرفاق ملف أو صورة"
          >
            <Plus className="w-5.5 h-5.5 text-[#aebac1] hover:text-[#00a884] transition-colors" />
          </button>
        </div>

        {/* Text Input area */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
          placeholder="اكتب رسالة..."
          className="flex-1 bg-[#2a3942] border border-transparent rounded-lg px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#00a884] text-[#e9edef] placeholder:text-[#8696a0]"
        />

        {/* Right Action: Mic or Send */}
        {text.trim() ? (
          <button
            onClick={handleSendText}
            className="p-2 rounded-full text-[#00a884] hover:bg-[#2a3942] transition-colors cursor-pointer shrink-0"
            title="إرسال الرسالة"
          >
            <Send className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="p-2 rounded-full text-[#aebac1] hover:text-[#00a884] hover:bg-[#2a3942] transition-colors cursor-pointer shrink-0"
            title="تسجيل رسالة صوتية حية"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
export default MessageComposer;
