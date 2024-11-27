import { ModalState } from '@/states/modalState';
import { popupState } from '@/states/popupState';
import { useSetRecoilState } from 'recoil';

export function usePopup() {
  const setPopup = useSetRecoilState(popupState);

  const openPopup = ({
    content = '',
    onClose,
  }: Partial<Omit<ModalState, 'isOpen'>>) => {
    setPopup({
      isOpen: true,
      content,
      onClose,
    });
  };

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  return { openPopup, closePopup };
}
