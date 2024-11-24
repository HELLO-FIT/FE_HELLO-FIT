import React, { useState, useEffect } from 'react';
import { TooltipProps } from './Tooltip.types';
import styles from './Tooltip.module.scss';
import { toggleState } from '@/states/toggleState';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';

export default function Tooltip({ text, children, position }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [firstVisit, setFirstVisit] = useState(false);
  const toggle = useRecoilValue(toggleState);

  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem('hasSeenTooltip');
    if (!hasSeenTooltip) {
      setFirstVisit(true);
      localStorage.setItem('hasSeenTooltip', 'true');
    }
  }, []);

  const handleMouseEnter = () => {
    if (firstVisit) {
      setVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  return (
    <div
      className={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
