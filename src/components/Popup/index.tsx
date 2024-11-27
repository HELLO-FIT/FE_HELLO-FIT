import { useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { popupState } from '@/states/popupState';
import styles from './Popup.module.scss';
import useOutsideClick from '@/hooks/useOutsideClick';
import { toggleState } from '@/states/toggleState';

export default function Popup() {
  const [popup, setPopup] = useRecoilState(popupState);
  const popupRef = useRef<HTMLDivElement>(null);
  const toggle = useRecoilValue(toggleState);

  const handleClose = () => {
    setPopup({ ...popup, isOpen: false });
    if (typeof popup.onClose === 'function') {
      popup.onClose();
    }
  };

  useOutsideClick(popupRef, handleClose);

  if (!popup.isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popupContent} ref={popupRef}>
        <div className={styles.texts}>
          <p className={styles.text}>{popup.content}</p>
        </div>
        <div className={styles.buttons}>
          <button
            className={`${toggle === 'general' ? styles.confirm : styles.confirmSP}`}
            onClick={handleClose}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
