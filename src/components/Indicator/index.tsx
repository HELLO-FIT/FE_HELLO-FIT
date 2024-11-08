import React from 'react';
import styles from './Indicator.module.scss';
import IconComponent from '../Asset/Icon';

interface IndicatorProps {
  onDragStart?: (event: React.MouseEvent | React.TouchEvent) => void;
}

export default function Indicator({ onDragStart }: IndicatorProps) {
  return (
    <div
      className={styles.indicatorContainer}
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}
    >
      <IconComponent name="indicator" size="custom" alt="Drag Indicator" />
    </div>
  );
}
