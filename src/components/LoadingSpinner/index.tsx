import React from 'react';
import styles from './LoadingSpinner.module.scss';
import { useRecoilValue } from 'recoil';
import { toggleState } from '@/states/toggleState';

export default function LoadingSpinner() {
  const toggle = useRecoilValue(toggleState);

  return (
    <div className={styles.spinnerContainer}>
      <div
        className={toggle === 'general' ? styles.spinner : styles.spinnerSP}
      ></div>
    </div>
  );
}
