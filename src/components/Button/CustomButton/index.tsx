import React from 'react';
import styles from './CustomButton.module.scss';

interface CustomButtonProps {
  label: string;
  onClick?: () => void;
}

export default function CustomButton({ label, onClick }: CustomButtonProps) {
  return (
    <button className={styles.button} onClick={onClick}>
      {label}
    </button>
  );
}
