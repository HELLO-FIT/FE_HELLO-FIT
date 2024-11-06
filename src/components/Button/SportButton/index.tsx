import React from 'react';
import styles from './SportButton.module.scss';

interface SportButtonProps {
  icon: string;
  label: string;
}

export default function SportButton({ icon, label }: SportButtonProps) {
  return (
    <div className={styles.sportButton}>
      <div className={styles.iconContainer}>
        <img src={icon} alt={label} className={styles.icon} />
      </div>
      <p className={styles.label}>{label}</p>
    </div>
  );
}
