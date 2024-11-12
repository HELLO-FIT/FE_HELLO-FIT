import React, { useState, useEffect } from 'react';
import ToggleButton from '@/components/Button/ToggleButton';
import styles from './Header.module.scss';
import IconComponent from '@/components/Asset/Icon';
import Tooltip from '@/components/Tooltip/Tooltip';
import { useRecoilState } from 'recoil';
import { toggleState } from '@/states/toggleState';

export default function Header() {
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

  // 로고 클릭 시 페이지 리로드
  const handleLogoClick = () => {
    window.location.href = '/map';
  };

  return (
    <header className={styles.header}>
      <div className={styles.btnContainer} onClick={handleLogoClick}>
        <IconComponent name={logoName} width={60} height={34} />
      </div>
      <div className={styles.toggleButtonContainer}>
        <Tooltip text="이용권에 따라 선택해주세요!">
          <ToggleButton onButtonClick={handleButtonClick} />
        </Tooltip>
      </div>
    </header>
  );
}
