import React from 'react';
import styles from './CustomButton.module.scss';
import { useRecoilValue } from 'recoil';
import { toggleState } from '@/states/toggleState';

interface CustomButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function CustomButton({
  label,
  onClick,
  disabled,
}: CustomButtonProps) {
  const toggle = useRecoilValue(toggleState);

  return (
    <button
      className={`${styles.button} ${toggle !== 'general' ? styles.buttonSP : ''} ${disabled ? styles.disabled : ''}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
