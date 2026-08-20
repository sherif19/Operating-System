import React from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, Phone, Lock, Save, Camera, CheckCircle2, AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { compressAndResizeImage } from '@/lib/utils/image-compressor';
import { FirebaseStorageService } from '@/lib/firebase/storage.service';
import { FirebaseFirestoreService } from '@/lib/firebase/firestore.service';

export function UserProfileModal() {
  const { user, updateUserProfile } = useAuthStore();
  const { isProfileModalOpen, setProfileModalOpen } = useUIStore();

  const [displayName, setDisplayName] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [avatarUrl, setAvatarUrl] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  
  const [isCompressing, setIsCompressing] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Initialize form with current user details when modal opens
  React.useEffect(() => {
    if (user && isProfileModalOpen) {
      setDisplayName(user.displayName || '');
      setPhoneNumber(user.phoneNumber || '');
      setAvatarUrl(user.avatarUrl || '');
      setPassword('');
      setConfirmPassword('');
      setSuccess(null);
      setError(null);
      setIsCompressing(false);
    }
  }, [user, isProfileModalOpen]);

  // Handle local image file upload, compress & upload directly to Firebase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('⚠️ يرجى اختيار ملف صورة صالح (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('⚠️ حجم الملف كبير جداً؛ الحد الأقصى المسموح به هو 10 ميجابايت.');
      return;
    }

    try {
      setIsCompressing(true);
      setError(null);
      const compressedDataUrl = await compressAndResizeImage(file, 300, 300, 0.85);

      // Upload directly to Firebase Storage
      const firebaseStorageUrl = await FirebaseStorageService.uploadAvatar(
        user?.id || 'usr-owner-1',
        compressedDataUrl
      );

      const finalUrl = firebaseStorageUrl || compressedDataUrl;
      setAvatarUrl(finalUrl);
      setSuccess('📸 تم رفع وصيانة الصورة بنجاح في Firebase Storage!');
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      console.error('Firebase Storage upload error', err);
      setError('❌ حدث خطأ أثناء رفع الصورة إلى Firebase، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemoveImage = () => {
    setAvatarUrl('');
    setSuccess('🗑️ تم إزالة الصورة. سيتم استخدام الحروف الأولى بدلاً منها عند الحفظ.');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleSave = () => {
    setError(null);
    setSuccess(null);

    if (!displayName.trim()) {
      setError('⚠️ الاسم الشخصي مطلوب ولا يمكن تركه فارغاً.');
      return;
    }

    // Password validation if they entered any characters
    if (password) {
      if (password.length < 6) {
        setError('⚠️ يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل.');
        return;
      }
      if (password !== confirmPassword) {
        setError('⚠️ كلمة المرور الجديدة وتأكيدها غير متطابقين.');
        return;
      }
    }

    // Save profile metadata to store & localStorage
    updateUserProfile(displayName, phoneNumber, avatarUrl);

    // Sync user profile data to Firestore
    if (user) {
      FirebaseFirestoreService.saveUserProfile({
        ...user,
        displayName,
        phoneNumber,
        avatarUrl,
      });
    }

    setSuccess('✅ تم تحديث وحفظ بيانات البروفايل في Firebase بنجاح!');
    setTimeout(() => {
      setSuccess(null);
      setProfileModalOpen(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isProfileModalOpen && user && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setProfileModalOpen(false)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.35 }}
            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-right text-xs overflow-hidden"
          >
            {/* Ambient Tech glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent blur-2xl pointer-events-none" />

            {/* Header Content */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <button
                onClick={() => setProfileModalOpen(false)}
                className="p-2 rounded-xl bg-slate-950/50 hover:bg-slate-800/80 border border-slate-800/60 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="text-right">
                <h3 className="text-sm font-black text-white">إعدادات الحساب والملف الشخصي</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">تحديث معلوماتك الشخصية، صورة الحساب والهاتف.</p>
              </div>
            </div>

            {/* Inline Notifications */}
            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2 mb-4 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl flex items-center gap-2 mb-4 animate-in fade-in slide-in-from-top-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Profile Avatar Upload */}
              <div className="flex flex-col items-center gap-3 py-3 bg-slate-950/30 border border-slate-800/60 rounded-2xl relative">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-2xl bg-indigo-600/10 border border-slate-700/80 overflow-hidden flex items-center justify-center text-indigo-400 text-xl font-black shadow-inner">
                    {isCompressing ? (
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                    ) : avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      displayName[0] || 'U'
                    )}
                  </div>
                  <label className="absolute inset-0 bg-slate-950/70 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-6 h-6 text-indigo-300" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isCompressing}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">
                    {isCompressing ? 'جاري معالجة الصورة...' : 'تغيير الصورة'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isCompressing}
                      className="hidden"
                    />
                  </label>
                  {avatarUrl && (
                    <>
                      <span className="text-slate-700">•</span>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-[11px] font-bold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>إزالة الصورة</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Display Name */}
              <div>
                <label className="block mb-1.5 text-slate-400 font-bold flex items-center gap-1.5 justify-end">
                  <span>الاسم الشخصي</span>
                  <User className="w-3.5 h-3.5 text-slate-500" />
                </label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="اكتب اسمك بالكامل..."
                  className="bg-slate-950 border-slate-800 text-xs text-right pr-3"
                />
              </div>

              {/* Email (Read-Only) */}
              <div>
                <label className="block mb-1.5 text-slate-500 font-bold flex items-center gap-1.5 justify-end">
                  <span>البريد الإلكتروني (غير قابل للتعديل)</span>
                  <Mail className="w-3.5 h-3.5 text-slate-600" />
                </label>
                <div className="w-full bg-slate-950/40 border border-slate-900 rounded-xl px-3 py-2 text-slate-500 text-left font-mono text-[11px] select-all">
                  {user.email}
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block mb-1.5 text-slate-400 font-bold flex items-center gap-1.5 justify-end">
                  <span>رقم الهاتف</span>
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                </label>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="05xxxxxxx"
                  className="bg-slate-950 border-slate-800 text-xs text-left pl-3"
                />
              </div>

              {/* Password Changes */}
              <div className="pt-2 border-t border-slate-800/80 space-y-3.5">
                <span className="text-[10px] text-slate-400 font-black flex items-center gap-1.5 justify-end">
                  <span>تغيير كلمة المرور (اختياري)</span>
                  <Lock className="w-3.5 h-3.5 text-indigo-400" />
                </span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-slate-500 text-[10px] font-bold">تأكيد كلمة المرور</label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-slate-950 border-slate-800 text-xs text-left"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-500 text-[10px] font-bold">كلمة المرور الجديدة</label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-slate-950 border-slate-800 text-xs text-left"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-5 mt-2 border-t border-slate-800/60">
              <Button
                onClick={handleSave}
                className="flex-1 h-9.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold shadow-lg shadow-indigo-600/15 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التغييرات</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setProfileModalOpen(false)}
                className="flex-1 h-9.5 border-slate-800 hover:bg-slate-800/40 text-slate-400 hover:text-white font-extrabold"
              >
                إلغاء
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
