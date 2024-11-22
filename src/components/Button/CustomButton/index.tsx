import React from 'react';
import styles from './CustomButton.module.scss';

interface CustomButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean; 
}

export default function CustomButton({ label, onClick, disabled }: CustomButtonProps) {
  return (
    <button
      className={`${styles.button} ${disabled ? styles.disabled : ''}`} 
      onClick={disabled ? undefined : onClick} 
      disabled={disabled}
    >
      {label}
    </button>
  );
}
