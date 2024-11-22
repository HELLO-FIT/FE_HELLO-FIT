import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ToggleButton from '@/components/Button/ToggleButton';
import styles from './Header.module.scss';
import IconComponent from '@/components/Asset/Icon';
import Tooltip from '@/components/Tooltip/Tooltip';
import { useRecoilState } from 'recoil';
import { toggleState } from '@/states/toggleState';

export default function Header() {
  const router = useRouter();
  const [logoName, setLogoName] = useState<'logoBlue' | 'logoGreen'>(
    'logoBlue'
  );
  const [toggle, setToggle] = useRecoilState(toggleState);

  useEffect(() => {
    if (toggle === 'special') {
      setLogoName('logoGreen');
    } else {
      setLogoName('logoBlue');
    }
  }, [toggle]);

  useEffect(() => {
    localStorage.setItem('toggleState', toggle);
  }, [toggle]);

  const handleButtonClick = (buttonType: 'general' | 'special') => {
    setToggle(buttonType);
  };

  const handleLogoClickWithRouter = () => {
    router.reload();
  };

  return (
    <header className={styles.header}>
      <div className={styles.btnContainer} onClick={handleLogoClickWithRouter}>
        <IconComponent name={logoName} width={60} height={34} />
      </div>
      <div className={styles.toggleButtonContainer}>
        <Tooltip text="이용권에 따라 선택해주세요!" position="right">
          <ToggleButton onButtonClick={handleButtonClick} />
        </Tooltip>
      </div>
    </header>
  );
}
