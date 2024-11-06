import React, { useState } from 'react';
import styles from './ToggleButton.module.scss';

interface ToggleButtonProps {
  onButtonClick?: (buttonType: 'general' | 'special') => void;
}

export default function ToggleButton({ onButtonClick }: ToggleButtonProps) {
  const [activeButton, setActiveButton] = useState<'general' | 'special'>(
    'general'
  );

  const handleClick = (buttonType: 'general' | 'special') => {
    setActiveButton(buttonType);
    if (onButtonClick) {
      onButtonClick(buttonType);
    }
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
