import React, { useState, useRef, useEffect } from 'react';
import IconComponent from '@/components/Asset/Icon';
import Chips from '@/components/Button/Chips';
import {
  NomalFacilityDetails,
  SpecialFacilityDetails,
} from '@/apis/get/getFacilityDetails';
import { formatPhoneNumber } from '@/utils/formatPhoneNumber';
import styles from './FacilityInfo.module.scss';
import { useRecoilValue } from 'recoil';
import { toggleState } from '@/states/toggleState';

interface FacilityInfoProps {
  facility: NomalFacilityDetails | SpecialFacilityDetails | null;
  onBackClick: () => void;
  onMoveToDetail: () => void;
  filterItem?: string | null;
}

export default function FacilityInfo({
  facility,
  onBackClick,
  onMoveToDetail,
  filterItem,
}: FacilityInfoProps) {
  const initialPosition = -50;
  const maxDragDistance = 150;
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const initialY = useRef(0);
  const toggle = useRecoilValue(toggleState);

  const isNormalFacility =
    toggle === 'general' && facility && 'serialNumber' in facility;

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

  // 인디케이터 클릭 시 하단으로 이동/올라오기
  const handleIndicatorClick = () => {
    setPosition(prevPosition =>
      prevPosition === maxDragDistance ? initialPosition : maxDragDistance
    );
  };

  useEffect(() => {
    setPosition(initialPosition);
  }, [facility, initialPosition]);

  const getLabelItem = () => {
    if (!facility || !facility.items || facility.items.length === 0)
      return '없음';

    if (filterItem && facility.items.includes(filterItem)) {
      return filterItem;
    }

    const frequency: Record<string, number> = {};
    facility.items.forEach(item => {
      frequency[item] = (frequency[item] || 0) + 1;
    });

    const mostFrequentItem = Object.entries(frequency).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    return mostFrequentItem;
  };

  if (!facility) return null;

  return (
    <div
      className={styles.facilityInfoContainer}
      style={{ transform: `translateY(${position}px)` }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onMouseMove={isDragging ? handleDragMove : undefined}
      onTouchMove={isDragging ? handleDragMove : undefined}
      onMouseUp={handleDragEnd}
      onTouchEnd={handleDragEnd}
    >
      <div className={styles.indicatorWrapper} onClick={handleIndicatorClick}>
        <IconComponent
          name="indicator"
          width={58}
          height={4}
          alt="Drag Indicator"
        />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 onClick={onMoveToDetail}>{facility.name}</h1>
          <div className={styles.rightIconWrapper} onClick={onMoveToDetail}>
            <IconComponent
              name="rightBold"
              size="m"
              alt="Move to Facility Detail"
            />
          </div>
          <div className={styles.closeIconWrapper} onClick={onBackClick}>
            <IconComponent
              name="closeCircle"
              size="m"
              alt="Back to PopularSports"
            />
          </div>
        </div>
        <div className={styles.chipsContainer}>
          <Chips
            chipState="sports"
            text={getLabelItem()}
            serialNumber={isNormalFacility ? true : false}
          />
        </div>
        <div className={styles.addressWrapper}>
          <IconComponent
            name={toggle === 'general' ? 'addressMarker' : 'addressMarkerSP'}
            width={16}
            height={16}
            alt="Address Marker Icon"
          />
          <p className={styles.addressInfo}>
            {facility.cityName} {facility.localName} {facility.address}
          </p>
        </div>
        <div className={styles.facilityDetails}>
          <div className={styles.contactRow}>
            <span className={styles.label}>연락처</span>
            <span className={styles.value}>
              {facility.phone
                ? formatPhoneNumber(facility.phone)
                : '연락처 없음'}
            </span>
          </div>
          {isNormalFacility && (
            <div className={styles.contactRow}>
              <span className={styles.label}>대표자</span>
              <span className={styles.value}>
                {facility.owner || '정보 없음'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
