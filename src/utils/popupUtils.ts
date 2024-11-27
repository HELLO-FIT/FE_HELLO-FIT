import { ModalState } from '@/states/modalState';
import { popupState } from '@/states/popupState';
import { useSetRecoilState } from 'recoil';

export function usePopup() {
  const setPopup = useSetRecoilState(popupState);

  const openPopup = ({
    content = '',
    onConfirm,
  }: Partial<Omit<ModalState, 'isOpen'>>) => {
    setPopup({
      isOpen: true,
      content,
      onConfirm,
    });
  };

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  return { openPopup, closePopup };
}
