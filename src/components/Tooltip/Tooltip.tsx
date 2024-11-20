import React, { useState } from 'react';
import { TooltipProps } from './Tooltip.types';
import styles from './Tooltip.module.scss';

export default function Tooltip({ text, children, position }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={styles.container}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className={
            position === 'left'
              ? `${styles.tooltipText} ${styles.left}`
              : `${styles.tooltipText} ${styles.right}`
          }
        >
          {text}
        </div>
      )}
    </div>
  );
}
