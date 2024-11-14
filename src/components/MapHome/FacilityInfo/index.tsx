import React, { useState, useRef, useEffect } from 'react';
import IconComponent from '@/components/Asset/Icon';
import Chips from '@/components/Button/Chips';
import { FacilityDetails } from '@/apis/get/getFacilityDetails';
import { formatPhoneNumber } from '@/utils/formatPhoneNumber';
import styles from './FacilityInfo.module.scss';

interface FacilityInfoProps {
  facility: FacilityDetails | null;
  onBackClick: () => void;
}

export default function FacilityInfo({
  facility,
  onBackClick,
}: FacilityInfoProps) {
  const initialPosition = -50;
  const maxDragDistance = 150;
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const initialY = useRef(0);

  const handleDragStart = (event: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    initialY.current =
      'touches' in event ? event.touches[0].clientY : event.clientY;
  };

  const handleDragMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const currentY =
      'touches' in event ? event.touches[0].clientY : event.clientY;
    const delta = currentY - initialY.current;

    setPosition(prevPosition => {
      const newPosition = prevPosition + delta;
      return Math.max(Math.min(newPosition, maxDragDistance), initialPosition);
    });

    initialY.current = currentY;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setPosition(prevPosition =>
      prevPosition < (maxDragDistance + initialPosition) / 2
        ? maxDragDistance
        : initialPosition
    );
  };

  useEffect(() => {
    setPosition(initialPosition);
  }, [facility, initialPosition]);

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
      <div className={styles.indicatorWrapper}>
        <IconComponent name="indicator" size="custom" alt="Drag Indicator" />
      </div>
      <div className={styles.content}>
        {/* h1과 backIconWrapper를 함께 감싼 header div 생성 */}
        <div className={styles.header}>
          <div className={styles.backIconWrapper} onClick={onBackClick}>
            <IconComponent name="left" size="l" alt="Back to PopularSports" />
          </div>
          <h1>{facility.name}</h1>
        </div>
        <div className={styles.chipsContainer}>
          <Chips chipState="sports" text={facility.items[0]} />
        </div>
        <p className={styles.addressInfo}>
          <IconComponent
            name="addressMarker"
            size="s"
            alt="Address Marker Icon"
          />{' '}
          {facility.cityName} {facility.localName} {facility.address}
        </p>
        <div className={styles.facilityDetails}>
          <div className={styles.contactRow}>
            <span className={styles.label}>연락처</span>
            <span className={styles.value}>
              {facility.phone
                ? formatPhoneNumber(facility.phone)
                : '연락처 없음'}
            </span>
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
