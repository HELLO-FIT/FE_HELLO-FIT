import React from 'react';
import IconComponent, { IconComponentProps } from '@/components/Asset/Icon';
import styles from './SportButton.module.scss';

interface SportButtonProps {
  iconName: IconComponentProps['name'];
  label: string;
}

export default function SportButton({ iconName, label }: SportButtonProps) {
  return (
    <div className={styles.sportButton}>
      <IconComponent name={iconName} size="m" alt={label} />
      <p className={styles.label}>{label}</p>
    </div>
  );
}
