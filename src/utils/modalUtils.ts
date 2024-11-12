import { ModalState, modalState } from '@/states/modalState';
import { useSetRecoilState } from 'recoil';

export function useModal() {
  const setModal = useSetRecoilState(modalState);

  const openModal = ({
    content = '',
    onConfirm,
    onClose,
  }: Partial<Omit<ModalState, 'isOpen'>>) => {
    setModal({
      isOpen: true,
      content,
      onConfirm,
      onClose,
    });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  return { openModal, closeModal };
}
