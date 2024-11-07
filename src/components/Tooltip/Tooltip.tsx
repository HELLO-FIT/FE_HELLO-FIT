import React, { useState } from 'react';
import { TooltipProps } from './Tooltip.types';
import styles from './Tooltip.module.scss';

export default function Tooltip({ text, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={styles.container}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && <div className={styles.tooltipText}>{text}</div>}
    </div>
  );
}
