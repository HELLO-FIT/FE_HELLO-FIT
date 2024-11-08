import React, { useState, useRef } from 'react';
import DropDown from '@/components/DropDown';
import SportButtonList from '@/components/SportButtonList';
import IconComponent from '../Asset/Icon';
import styles from './PopularSports.module.scss';

const locationOptions = [
  '서울 종로구',
  '서울 중구',
  '서울 용산구',
  '서울 성동구',
  '서울 광진구',
  '서울 동대문구',
  '서울 중랑구',
  '서울 성북구',
  '서울 강북구',
  '서울 도봉구',
  '서울 노원구',
  '서울 은평구',
  '서울 서대문구',
  '서울 마포구',
  '서울 양천구',
  '서울 강서구',
  '서울 구로구',
  '서울 금천구',
  '서울 영등포구',
  '서울 동작구',
  '서울 관악구',
  '서울 서초구',
  '서울 강남구',
  '서울 송파구',
  '서울 강동구',
];

export default function PopularSports() {
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const initialY = useRef(0);
  const maxDragDistance = 140;
  // 모바일 일 때는 문제없으나 pc 일 때는 다른 요소에도 드래그 적용되는 이슈
  const handleDragStart = (event: React.MouseEvent | React.TouchEvent) => {
    const target = event.target as Element; // 타입 단언

    if (!target.closest(`.${styles.indicatorContainer}`)) return; // 인디케이터에서만 드래그 시작 허용
    setIsDragging(true);
    initialY.current =
      'touches' in event ? event.touches[0].clientY : event.clientY;
    event.stopPropagation(); // 이벤트 전파 중단
  };

  const handleDragMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const currentY =
      'touches' in event ? event.touches[0].clientY : event.clientY;
    const delta = currentY - initialY.current;

    setPosition(prevPosition => {
      const newPosition = prevPosition + delta;
      return Math.max(Math.min(newPosition, maxDragDistance), 0);
    });

    initialY.current = currentY;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setPosition(prevPosition =>
      prevPosition < maxDragDistance / 2 ? maxDragDistance : 0
    );
  };

  return (
    <div className={styles.popularSportsContainerWrapper}>
      <div
        className={styles.popularSportsContainer}
        style={{ transform: `translateY(${position}px)` }}
        onMouseMove={
          isDragging ? e => handleDragMove(e as React.MouseEvent) : undefined
        }
        onTouchMove={
          isDragging ? e => handleDragMove(e as React.TouchEvent) : undefined
        }
        onMouseUp={handleDragEnd}
        onTouchEnd={handleDragEnd}
      >
        <div
          className={styles.indicatorContainer}
          onMouseDown={e => {
            handleDragStart(e as React.MouseEvent);
          }}
          onTouchStart={e => {
            handleDragStart(e as React.TouchEvent);
          }}
          style={{ cursor: 'grab' }}
        >
          <IconComponent name="indicator" size="custom" alt="Drag Indicator" />
        </div>
        <header className={styles.header}>
          <DropDown
            placeholder="지역"
            options={locationOptions}
            onSelect={selectedLocation =>
              console.log('선택된 위치:', selectedLocation)
            }
          />
        </header>
        <h2 className={styles.title}>인기 스포츠</h2>
        <SportButtonList />
      </div>
    </div>
  );
}
