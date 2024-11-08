import React from 'react';
import Image from 'next/image';
import styles from './SportButton.module.scss';

interface SportButtonProps {
  icon: string;
  label: string;
}

export default function SportButton({ icon, label }: SportButtonProps) {
  return (
    <div className={styles.sportButton}>
      <div className={styles.iconContainer}>
        <Image
          src={icon}
          alt={label}
          width={50}
          height={50}
          className={styles.icon}
        />
      </div>
      <p className={styles.label}>{label}</p>
    </div>
  );
}
