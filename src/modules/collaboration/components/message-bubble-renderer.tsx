import React from 'react';
import { Message } from '../types/domain.types';
import { Badge } from '@/components/ui/badge';
import { CheckCheck, Check, Play, Pause, Smile, ChevronDown, FileText, Download, FileArchive, Music } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

interface MessageBubbleRendererProps {
  message: Message;
  onReact: (id: string, emoji: string) => void;
  onConvertToTask: (text: string) => void;
  onConvertToSOP: (text: string) => void;
}

export function MessageBubbleRenderer({ message, onReact, onConvertToTask, onConvertToSOP }: MessageBubbleRendererProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [speed, setSpeed] = React.useState<'1x' | '1.5x' | '2x'>('1x');
  const [showReactions, setShowReactions] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const currentUser = useAuthStore((state) => state.user);
  const isMe = message.senderId === currentUser?.id || message.senderId === 'emp-owner';
  const isAI = message.senderId === 'bot';

  const reactionsList = ['👍', '❤️', '😂', '🔥', '🎉'];
  const waveBars = [12, 18, 8, 22, 14, 28, 10, 24, 16, 32, 12, 20, 8, 24, 14, 18];

  // Handle Play / Pause for Real Audio
  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.error('Audio play error', err));
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = () => {
    const nextSpeed = speed === '1x' ? '1.5x' : speed === '1.5x' ? '2x' : '1x';
    setSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed === '1.5x' ? 1.5 : nextSpeed === '2x' ? 2 : 1;
    }
  };

  return (
    <div className={`flex flex-col gap-1 max-w-[75%] ${isMe ? 'self-end' : 'self-start'}`}>
      <div
        className={`p-3 rounded-2xl relative group shadow-sm ${
          isMe
            ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'
            : 'bg-[#202c33] text-[#e9edef] rounded-tl-none'
        }`}
      >
        {/* Author name for Group/Channels */}
        {!isMe && (
          <span className={`text-[10px] font-extrabold block mb-1.5 ${isAI ? 'text-[#00a884]' : 'text-slate-400'}`}>
            {message.senderName}
          </span>
        )}

        {/* 1. Voice Note Player */}
        {message.voiceUrl ? (
          <div className="flex items-center gap-3.5 py-1 text-xs">
            {/* Hidden HTML5 Audio Element */}
            <audio
              ref={audioRef}
              src={message.voiceUrl}
              onEnded={() => setIsPlaying(false)}
              onPause={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              className="hidden"
            />

            <div className="w-9 h-9 rounded-full bg-[#111b21] border border-[#222e35] flex items-center justify-center text-[10px] font-black text-[#00a884] shrink-0 overflow-hidden">
              {message.senderAvatarUrl ? (
                <img src={message.senderAvatarUrl} alt={message.senderName} className="w-full h-full object-cover" />
              ) : (
                message.senderName[0] || 'U'
              )}
            </div>

            <button
              onClick={togglePlayAudio}
              className="w-9 h-9 rounded-full bg-[#00a884] hover:bg-[#008f72] flex items-center justify-center text-[#111b21] cursor-pointer shrink-0 transition-colors shadow"
              title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل الصوتي'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-[#111b21] text-[#111b21]" />
              ) : (
                <Play className="w-4 h-4 fill-[#111b21] text-[#111b21] mr-0.5" />
              )}
            </button>

            {/* Custom Visual Waveform bars */}
            <div className="flex-1 flex flex-col gap-1 min-w-36">
              <div className="flex items-end gap-[2.5px] h-8 pt-2">
                {waveBars.map((height, idx) => (
                  <span
                    key={idx}
                    style={{ height: `${height}px` }}
                    className={`w-[3px] rounded-full transition-colors duration-300 ${
                      isPlaying && idx < 10 ? 'bg-[#53bdeb]' : 'bg-[#8696a0]'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-[9px] text-[#8696a0] font-mono">
                <span>{message.voiceDuration || '0:15'}</span>
                <button
                  onClick={handleSpeedChange}
                  className="px-1.5 py-0.5 rounded bg-[#111b21] text-[#00a884] font-bold text-[8px] hover:bg-[#1a2830] cursor-pointer"
                >
                  {speed}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* 2. File Attachment View */}
        {message.file && (
          <div className="mb-2">
            {message.file.type === 'image' ? (
              <div className="rounded-xl overflow-hidden border border-[#222e35] max-w-xs my-1 bg-[#111b21]">
                <img
                  src={message.file.url}
                  alt={message.file.name}
                  className="w-full max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(message.file?.url, '_blank')}
                />
                <div className="p-2 flex items-center justify-between text-[10px] text-slate-400 bg-[#111b21]/90">
                  <span className="truncate font-bold text-[#e9edef]">{message.file.name}</span>
                  <span className="shrink-0 text-[9px]">{message.file.size}</span>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-[#111b21]/80 border border-[#222e35] flex items-center justify-between gap-3 text-xs my-1 hover:bg-[#111b21] transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#202c33] border border-[#222e35] flex items-center justify-center shrink-0 text-[#00a884]">
                    {message.file.type === 'pdf' ? (
                      <FileText className="w-5 h-5 text-rose-400" />
                    ) : message.file.type === 'archive' ? (
                      <FileArchive className="w-5 h-5 text-amber-400" />
                    ) : message.file.type === 'audio' ? (
                      <Music className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <FileText className="w-5 h-5 text-indigo-400" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-[#e9edef] text-[11px] truncate">{message.file.name}</span>
                    <span className="text-[9px] text-[#8696a0] font-mono">{message.file.size}</span>
                  </div>
                </div>

                <a
                  href={message.file.url}
                  download={message.file.name}
                  className="p-1.5 rounded-lg bg-[#202c33] hover:bg-[#00a884] hover:text-[#111b21] text-slate-300 transition-colors shrink-0"
                  title="تنزيل الملف"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* 3. Text Message */}
        {message.text && (!message.voiceUrl || message.text !== '🎙️ رسالة صوتية') && (
          <p className="text-xs leading-relaxed break-words font-sans text-[#e9edef]">
            {message.text}
          </p>
        )}

        {/* Meta / Read Receipts */}
        <div className="flex items-center justify-end gap-1.5 mt-1.5 text-[8px] text-[#8696a0] font-mono">
          <span>{message.createdAt}</span>
          {isMe && (
            message.status === 'read' ? (
              <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb] shrink-0" />
            ) : (
              <Check className="w-3.5 h-3.5 text-[#8696a0] shrink-0" />
            )
          )}
        </div>

        {/* Floating action trigger on Hover */}
        <div className="absolute top-1 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-20">
          <button
            onClick={() => setShowReactions(!showReactions)}
            className="p-1 rounded bg-[#111b21] border border-[#222e35] text-slate-400 hover:text-white cursor-pointer"
          >
            <Smile className="w-3 h-3" />
          </button>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded bg-[#111b21] border border-[#222e35] text-slate-400 hover:text-white cursor-pointer"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Reaction picker popover */}
        {showReactions && (
          <div className="absolute top-[-34px] left-2 bg-[#111b21] border border-[#222e35] p-1.5 rounded-xl flex gap-1.5 z-30 shadow-lg animate-in fade-in zoom-in-95 duration-100">
            {reactionsList.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onReact(message.id, emoji);
                  setShowReactions(false);
                }}
                className="hover:scale-125 transition-transform text-xs cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Actions Context Menu */}
        {showMenu && (
          <div className="absolute top-7 left-2 bg-[#111b21] border border-[#222e35] py-1.5 rounded-xl flex flex-col z-30 shadow-lg min-w-36 text-right">
            <button
              onClick={() => {
                onConvertToTask(message.text);
                setShowMenu(false);
              }}
              className="px-3 py-1.5 text-[10px] text-cyan-400 hover:bg-[#202c33] w-full text-right cursor-pointer font-bold"
            >
              🔄 تحويل لمهمة عمل
            </button>
            <button
              onClick={() => {
                onConvertToSOP(message.text);
                setShowMenu(false);
              }}
              className="px-3 py-1.5 text-[10px] text-[#00a884] hover:bg-[#202c33] w-full text-right cursor-pointer font-bold"
            >
              📚 حفظ في قاعدة المعرفة
            </button>
          </div>
        )}
      </div>

      {/* Render Active Reactions count list */}
      {message.reactions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-0.5 px-1.5">
          {message.reactions.map((r, idx) => (
            <Badge key={idx} variant="outline" className="text-[8px] bg-[#111b21] border-[#222e35] text-slate-300 px-1.5 py-0.5">
              {r.emoji}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
export default MessageBubbleRenderer;
