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
    <div className={styles.toggle}>
      <button
        className={`${styles.toggleOption} ${activeButton === 'general' ? styles.active : ''}`}
        onClick={() => handleClick('general')}
      >
        일반
      </button>
      <button
        className={`${styles.toggleOption} ${activeButton === 'special' ? `${styles.active} ${styles.specialActive}` : ''}`}
        onClick={() => handleClick('special')}
      >
        특수
      </button>
    </div>
  );
}
