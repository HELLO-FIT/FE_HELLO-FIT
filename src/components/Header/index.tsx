import React, { useState } from 'react';
import ToggleButton from '@/components/ToggleButton';
import styles from './Header.module.scss';
import IconComponent from '@/components/Asset/Icon';

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
        <ToggleButton onButtonClick={handleButtonClick} />
      </div>
    </header>
  );
}
