import React from 'react';
import IconComponent, { IconComponentProps } from '@/components/Asset/Icon';
import styles from './SportButton.module.scss';

interface SportButtonProps {
  iconName: IconComponentProps['name'];
  label: string;
  onClick: () => void;
  isSelected: boolean; 
}

export default function SportButton({ iconName, label, onClick, isSelected }: SportButtonProps) {
  return (
    <div
      className={`${styles.sportButton} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
    >
      <div className={styles.iconContainer}>
        <IconComponent name={iconName} size="m" alt={label} />
      </div>
      <p className={styles.label}>{label}</p>
    </div>
  );
}
