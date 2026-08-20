import { create } from 'zustand';

export interface CustomDialogConfig {
  isOpen: boolean;
  type: 'alert' | 'confirm';
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface DialogState {
  dialog: CustomDialogConfig;
  showAlert: (title: string, message: string, onConfirm?: () => void) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => void;
  closeDialog: () => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  dialog: {
    isOpen: false,
    type: 'alert',
    title: '',
    message: '',
  },
  showAlert: (title, message, onConfirm) => set({
    dialog: {
      isOpen: true,
      type: 'alert',
      title,
      message,
      onConfirm,
    }
  }),
  showConfirm: (title, message, onConfirm, onCancel) => set({
    dialog: {
      isOpen: true,
      type: 'confirm',
      title,
      message,
      onConfirm,
      onCancel,
    }
  }),
  closeDialog: () => set((state) => ({
    dialog: { ...state.dialog, isOpen: false }
  })),
}));
