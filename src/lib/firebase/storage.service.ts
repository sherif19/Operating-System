import { ref, uploadBytes, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

export class FirebaseStorageService {
  /**
   * Upload user profile avatar to Firebase Storage under avatars/ folder
   */
  static async uploadAvatar(userId: string, imageFileOrDataUrl: File | string): Promise<string> {
    try {
      const filename = `${userId}_${Date.now()}`;
      const storageRef = ref(storage, `avatars/${filename}`);

      if (typeof imageFileOrDataUrl === 'string') {
        await uploadString(storageRef, imageFileOrDataUrl, 'data_url');
      } else {
        await uploadBytes(storageRef, imageFileOrDataUrl);
      }

      const downloadUrl = await getDownloadURL(storageRef);
      console.log('Firebase Storage: Avatar uploaded successfully ->', downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.warn('Firebase Storage uploadAvatar warning, fallback to local URL:', error);
      return typeof imageFileOrDataUrl === 'string' ? imageFileOrDataUrl : '';
    }
  }

  /**
   * Upload voice note recording Blob to Firebase Storage under voice_notes/ folder
   */
  static async uploadVoiceNote(conversationId: string, audioBlob: Blob): Promise<string> {
    try {
      const filename = `${Date.now()}_voice.webm`;
      const storageRef = ref(storage, `voice_notes/${conversationId}/${filename}`);

      await uploadBytes(storageRef, audioBlob, { contentType: 'audio/webm' });
      const downloadUrl = await getDownloadURL(storageRef);
      console.log('Firebase Storage: Voice note uploaded successfully ->', downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.warn('Firebase Storage uploadVoiceNote warning:', error);
      return '';
    }
  }

  /**
   * Upload chat file attachment to Firebase Storage under chat_files/ folder
   */
  static async uploadChatFile(conversationId: string, fileOrDataUrl: File | Blob | string, fileName: string): Promise<string> {
    try {
      const safeName = fileName.replace(/[^a-zA-Z0-9_.-]/g, '_');
      const storageRef = ref(storage, `chat_files/${conversationId}/${Date.now()}_${safeName}`);

      if (typeof fileOrDataUrl === 'string') {
        await uploadString(storageRef, fileOrDataUrl, 'data_url');
      } else {
        await uploadBytes(storageRef, fileOrDataUrl);
      }

      const downloadUrl = await getDownloadURL(storageRef);
      console.log('Firebase Storage: Chat file uploaded successfully ->', downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.warn('Firebase Storage uploadChatFile warning:', error);
      return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '';
    }
  }
}
