import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { toggleState } from '@/states/toggleState';
import styles from './ToggleButton.module.scss';

interface ToggleButtonProps {
  onButtonClick?: (buttonType: 'general' | 'special') => void;
}

export default function ToggleButton({ onButtonClick }: ToggleButtonProps) {
  const [toggle, setToggle] = useRecoilState(toggleState);
  const [activeButton, setActiveButton] = useState<'general' | 'special'>(
    'general'
  );

  useEffect(() => {
    if (toggle === 'special') {
      setActiveButton('special');
    } else {
      setActiveButton('general');
    }
  }, [toggle]);

  const handleClick = (buttonType: 'general' | 'special') => {
    setActiveButton(buttonType);
    setToggle(buttonType);
    if (onButtonClick) {
      onButtonClick(buttonType);
    }
    localStorage.setItem('toggleState', buttonType);
  };

  return (
    <div
      className={styles.toggle}
      onClick={() =>
        handleClick(activeButton === 'general' ? 'special' : 'general')
      }
    >
      <div
        className={styles.slider}
        style={{
          transform:
            activeButton === 'special' ? 'translateX(100%)' : 'translateX(0)',
        }}
      />
      <button
        className={`${styles.toggleOption} ${activeButton === 'general' ? styles.active : ''}`}
        onClick={e => {
          e.stopPropagation();
          handleClick('general');
        }}
      >
        일반
      </button>
      <button
        className={`${styles.toggleOption} ${activeButton === 'special' ? `${styles.active} ${styles.specialActive}` : ''}`}
        onClick={e => {
          e.stopPropagation();
          handleClick('special');
        }}
      >
        특수
      </button>
    </div>
  );
}
