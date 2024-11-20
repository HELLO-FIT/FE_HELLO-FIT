import React, { useState } from 'react';
import { TooltipProps } from './Tooltip.types';
import styles from './Tooltip.module.scss';
import { toggleState } from '@/states/toggleState';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';

export default function Tooltip({ text, children, position }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const toggle = useRecoilValue(toggleState);

  return (
    <div
      className={styles.container}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className={classNames({
            [styles.left]: position === 'left',
            [styles.right]: position !== 'left',
            [styles.tooltipText]: toggle === 'general',
            [styles.tooltipTextSP]: toggle !== 'general',
          })}
        >
          {text}
        </div>
      )}
    </div>
  );
}
