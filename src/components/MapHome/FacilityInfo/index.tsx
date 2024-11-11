import React, { useState, useRef } from 'react';
import Chips from '@/components/Button/Chips';
import IconComponent from '@/components/Asset/Icon';
import { Facility } from '@/apis/get/getFacilities';
import styles from './FacilityInfo.module.scss';

interface FacilityInfoProps {
  facility: Facility | null;
}

export default function FacilityInfo({ facility }: FacilityInfoProps) {
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

    setPosition((prevPosition) => {
      const newPosition = prevPosition + delta;
      return Math.max(Math.min(newPosition, maxDragDistance), 0);
    });

    initialY.current = currentY;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setPosition((prevPosition) => (prevPosition < maxDragDistance / 2 ? maxDragDistance : 0));
  };

  if (!facility) return null;

  return (
    <div
      className={styles.facilityInfoContainer}
      style={{ transform: `translateY(${position}px)` }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onMouseMove={isDragging ? handleDragMove : undefined}
      onMouseUp={handleDragEnd}
      onTouchMove={isDragging ? handleDragMove : undefined}
      onTouchEnd={handleDragEnd}
    >
      <IconComponent name="indicator" size="custom" alt="Drag Indicator" />
      <div className={styles.content}>
        <h1>{facility.name}</h1>
        <div className={styles.chipsContainer}>
          <Chips chipState="sports" text={facility.items[0]} />
        </div>
        <p className={styles.addressInfo}>
          <IconComponent name="addressMarker" size="s" alt="Address Marker Icon" />{' '}
          {facility.cityName} {facility.localName} {facility.address}
        </p>
        <div className={styles.facilityDetails}>
          <div className={styles.contactRow}>
            <span className={styles.label}>연락처</span>
            {/* 연락처 데이터가 없는 것 같아서 식별을 위해 임의로 시리얼 넘버로 지정 */}
            <span className={styles.value}>{facility.serialNumber}</span>
          </div>
          <div className={styles.contactRow}>
            <span className={styles.label}>대표자</span>
            <span className={styles.value}>{facility.owner}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
