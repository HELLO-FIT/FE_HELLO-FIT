import React, { useState, useRef } from 'react';
import DropDown from '@/components/DropDown';
import SportButtonList from '@/components/MapHome/SportButtonList';
import IconComponent from '@/components/Asset/Icon';
import styles from './PopularSports.module.scss';

interface PopularSportsProps {
  onSelectSport: (sport: string) => void;
}

export default function PopularSports({ onSelectSport }: PopularSportsProps) {
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 열림 상태 (수정중)
  const initialY = useRef(0);
  const maxDragDistance = 140;

  const handleDragStart = (event: React.MouseEvent | React.TouchEvent) => {
    if (isDropdownOpen) return; // 드롭다운이 열려 있으면 드래그 비활성화 (수정중)
    setIsDragging(true);
    initialY.current =
      'touches' in event ? event.touches[0].clientY : event.clientY;
  };

  const handleDragMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || isDropdownOpen) return; // 드래그 중 또는 드롭다운 열림 상태 확인 (수정중)

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
    if (!isDragging) return;
    setIsDragging(false);
    setPosition(prevPosition =>
      prevPosition < maxDragDistance / 2 ? maxDragDistance : 0
    );
  };

  return (
    <div
      className={styles.popularSportsContainer}
      style={{ transform: `translateY(${position}px)` }}
      onMouseDown={isDropdownOpen ? undefined : handleDragStart} // 드롭다운이 열려 있으면 드래그 비활성화 (수정중)
      onTouchStart={isDropdownOpen ? undefined : handleDragStart}
      onMouseMove={isDragging && !isDropdownOpen ? handleDragMove : undefined}
      onTouchMove={isDragging && !isDropdownOpen ? handleDragMove : undefined}
      onMouseUp={isDragging ? handleDragEnd : undefined}
      onTouchEnd={isDragging ? handleDragEnd : undefined}
    >
      <IconComponent name="indicator" size="custom" alt="Drag Indicator" />
      <div className={styles.content}>
        <header className={styles.header}>
          <DropDown
            placeholder="지역"
            options={['서울 송파구', '서울 종로구']} // 임의 지정
            onSelect={selectedLocation =>
              console.log('선택된 위치:', selectedLocation)
            }
            onOpen={() => setIsDropdownOpen(true)} // 드롭다운 열릴 때 상태 업데이트 (수정중)
            onClose={() => setIsDropdownOpen(false)} // 드롭다운 닫힐 때 상태 업데이트 (수정중)
          />
        </header>
        <h2 className={styles.title}>인기 스포츠</h2>
        <SportButtonList onSelectSport={onSelectSport} />
      </div>
    </div>
  );
}
