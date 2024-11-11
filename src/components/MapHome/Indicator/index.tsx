// 리팩토링 때 컴포넌트 분리 예정
import React, { useState, useRef } from 'react';
import styles from './Indicator.module.scss';
// import IconComponent from '@/components/Asset/Icon';
import FacilityInfo from '@/components/MapHome/FacilityInfo';
import PopularSports from '@/components/MapHome/PopularSports';
import { Facility } from '@/apis/get/getFacilities';

interface IndicatorProps {
  selectedFacility: Facility | null;
  indicatorMode: 'sports' | 'facilityInfo';
}

export default function Indicator({ selectedFacility, indicatorMode }: IndicatorProps) {
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const initialY = useRef(0);
  const maxDragDistance = 140;

  const handleDragStart = (event: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    initialY.current = 'touches' in event ? event.touches[0].clientY : event.clientY;
  };

  const handleDragMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const currentY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    const delta = currentY - initialY.current;

    setPosition(prevPosition => {
      const newPosition = prevPosition + delta;
      return Math.max(Math.min(newPosition, maxDragDistance), 0);
    });

    initialY.current = currentY;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setPosition(prevPosition => (prevPosition < maxDragDistance / 2 ? maxDragDistance : 0));
  };

  return (
    <div
      className={styles.indicatorContainer}
      style={{ transform: `translateY(${position}px)` }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onMouseMove={isDragging ? handleDragMove : undefined}
      onMouseUp={handleDragEnd}
      onTouchMove={isDragging ? handleDragMove : undefined}
      onTouchEnd={handleDragEnd}
    >
      {/* <IconComponent name="indicator" size="custom" alt="Drag Indicator" /> */}
      <div className={styles.content}>
        {indicatorMode === 'sports' ? (
          <PopularSports />
        ) : (
          selectedFacility && <FacilityInfo facility={selectedFacility} />
        )}
      </div>
    </div>
  );
}
