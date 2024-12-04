import React, { useState } from 'react';
import { TooltipProps } from './Tooltip.types';
import styles from './Tooltip.module.scss';
import { toggleState } from '@/states/toggleState';
import { useRecoilState, useRecoilValue } from 'recoil';
import { tooltipAtom } from '@/states/tooltipState';
import classNames from 'classnames';

export default function Tooltip({ text, children, position }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [hasSeenTooltip, setHasSeenTooltip] = useRecoilState(tooltipAtom);
  const toggle = useRecoilValue(toggleState);

  const handleMouseEnter = () => {
    if (!hasSeenTooltip) {
      setVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setVisible(false);
    if (!hasSeenTooltip) {
      setHasSeenTooltip(true);
    }
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
            [styles.right]: position === 'right',
            [styles.center]: position === 'center',
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
