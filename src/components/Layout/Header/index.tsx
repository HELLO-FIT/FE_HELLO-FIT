import React, { useState } from 'react';
import ToggleButton from '@/components/ToggleButton';
import styles from './Header.module.scss';
import IconComponent from '@/components/Asset/Icon';
import Tooltip from '@/components/Tooltip/Tooltip';

export default function Header() {
  const [logoName, setLogoName] = useState<'logoBlue' | 'logoGreen'>(
    'logoBlue'
  );

  const handleButtonClick = (buttonType: 'general' | 'special') => {
    setLogoName(buttonType === 'special' ? 'logoGreen' : 'logoBlue');
  };

  return (
    <header className={styles.header}>
      <IconComponent name={logoName} width={60} height={34} />
      <div className={styles.toggleButtonContainer}>
        <Tooltip text="이용권에 따라 선택해주세요!">
          <ToggleButton onButtonClick={handleButtonClick} />
        </Tooltip>
      </div>
    </header>
  );
}
