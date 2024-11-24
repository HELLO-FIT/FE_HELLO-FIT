import React, { useState, useEffect, useRef } from 'react';
import LocalFilter from '@/components/Lesson/LocalFilter';
import SportButtonList from '@/components/MapHome/SportButtonList';
import { generalSports, specialSports } from '@/constants/popularList';
import { cityCodes, localCodes } from '@/constants/localCode';
import styles from './PopularSports.module.scss';
import IconComponent from '@/components/Asset/Icon';
import { getFullRegionName } from '@/utils/getFullRegionName';
import GNB from '@/components/Layout/GNB';

interface PopularSportsProps {
  onSelectSport: (sport: string) => void;
  mode: 'general' | 'special';
  onRegionSelect?: (region: string, fullRegionName: string) => void;
  selectedRegion: string;
  onLocalFilterToggle: (isOpen: boolean) => void; 
}

export default function PopularSports({
  onSelectSport,
  mode,
  onRegionSelect,
  selectedRegion,
  onLocalFilterToggle,
}: PopularSportsProps) {
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const initialY = useRef(0);
  const maxDragDistance = 140;
  const [isLocalFilterOpen, setIsLocalFilterOpen] = useState(false);

  const [currentOptions, setCurrentOptions] = useState<{
    [key: string]: string;
  }>({});
  const [isNextStep, setIsNextStep] = useState(false);
  const [selectedCityCode, setSelectedCityCode] = useState<string>('11');
  const [selectedLocalCode, setSelectedLocalCode] = useState<string>('');

  // 시도 선택 시 구/군 옵션 설정
  useEffect(() => {
    if (selectedCityCode && localCodes[selectedCityCode]) {
      setCurrentOptions(localCodes[selectedCityCode]);
    } else {
      setCurrentOptions({});
    }
  }, [selectedCityCode]);

  // 옵션 선택 핸들러
  const handleValueChange = (key: string) => {
    if (isNextStep) {
      setSelectedLocalCode(key);
    } else {
      setSelectedCityCode(key);
    }
  };

  // "다음" 버튼 핸들러
  const handleNextClick = () => {
    if (selectedCityCode) {
      setIsNextStep(true);
    }
  };

  // "선택 완료" 버튼 핸들러
  const handleCompleteClick = () => {
    if (selectedCityCode && selectedLocalCode) {
      setIsNextStep(false);
      const fullRegionName = getFullRegionName(
        selectedCityCode,
        selectedLocalCode
      );

      // 상위 컴포넌트로 fullRegionName 전달
      if (onRegionSelect) {
        onRegionSelect(selectedLocalCode, fullRegionName);
      }
    }
  };

  // 드래그 이벤트 핸들러
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

  const handleLocalFilterToggle = (isOpen: boolean) => {
    setIsLocalFilterOpen(isOpen);
    onLocalFilterToggle(isOpen); // 부모로 상태 전달
  };

  return (
    <div
      className={styles.popularSportsContainer}
      style={{ transform: `translateY(${position}px)` }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onMouseMove={isDragging ? handleDragMove : undefined}
      onTouchMove={isDragging ? handleDragMove : undefined}
      onMouseUp={handleDragEnd}
      onTouchEnd={handleDragEnd}
    >
      <div className={styles.indicatorWrapper}>
        <IconComponent name="indicator" size="custom" alt="Drag Indicator" />
      </div>

      <div className={styles.content}>
        <header className={styles.header}>
          <LocalFilter
            options={isNextStep ? currentOptions : cityCodes}
            value={isNextStep ? selectedLocalCode : selectedCityCode}
            onChange={handleValueChange}
            title={isNextStep ? '구/군 선택 (2/2)' : '시/도 선택 (1/2)'}
            placeholder={selectedRegion}
            onNextClick={handleNextClick}
            onCompleteClick={handleCompleteClick}
            isNextStep={isNextStep}
            onToggle={handleLocalFilterToggle}
          />
        </header>

        {!isLocalFilterOpen && (
          <>
            <h2 className={styles.title}>인기 스포츠</h2>
            <SportButtonList
              sports={mode === 'general' ? generalSports : specialSports}
              onSelectSport={onSelectSport}
            />
          </>
        )}
      </div>

      {!isLocalFilterOpen && <GNB />}
    </div>
  );
}
