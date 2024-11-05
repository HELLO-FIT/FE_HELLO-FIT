import React from 'react';
import ToggleButton from '@/components/ToggleButton';
import styles from './Header.module.scss';;
import IconComponent from '@/components/Asset/Icon';

export default function Header() {
  return (
    <header className={styles.header}>
      <IconComponent name={'logoBlue'} width={60} height={34} />
      <div className={styles.toggleButtonContainer}>
        <ToggleButton />
      </div>
    </header>
  );
}
