import { atom } from 'recoil';

export interface ModalState {
  isOpen: boolean;
  content: string;
  onConfirm?: () => void;
  onClose?: () => void;
}

export const modalState = atom<ModalState>({
  key: 'modalState',
  default: {
    isOpen: false,
    content: '',
    onConfirm: undefined,
    onClose: undefined,
  },
});
