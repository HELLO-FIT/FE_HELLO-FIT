import { atom } from 'recoil';

export interface PopupState {
  isOpen: boolean;
  content: string;
  onClose?: () => void;
}

export const popupState = atom<PopupState>({
  key: 'popupState',
  default: {
    isOpen: false,
    content: '',
    onClose: undefined,
  },
});
