import React, { useState, useEffect, useRef } from 'react';
import LocalFilter from '@/components/Lesson/LocalFilter';
import SportButtonList from '@/components/MapHome/SportButtonList';
import { generalSports, specialSports } from '@/constants/popularList';
import { cityCodes, localCodes } from '@/constants/localCode';
import styles from './PopularSports.module.scss';
import IconComponent from '@/components/Asset/Icon';
import { getFullRegionName } from '@/utils/getFullRegionName';

interface PopularSportsProps {
  onSelectSport: (sport: string) => void;
  mode: 'general' | 'special';
  onRegionSelect?: (region: string, fullRegionName: string) => void;
  selectedRegion: string;
}

export default function PopularSports({
  onSelectSport,
  mode,
  onRegionSelect,
  selectedRegion,
}: PopularSportsProps) {
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const initialY = useRef(0);
  const maxDragDistance = 130;

  const [currentOptions, setCurrentOptions] = useState<{
    [key: string]: string;
  }>({});
  const [isNextStep, setIsNextStep] = useState(false);
  const [selectedCityCode, setSelectedCityCode] = useState<string>('11');
  const [selectedLocalCode, setSelectedLocalCode] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
    if (isFilterOpen) return; // 필터가 열려 있을 때 드래그 막기
    setIsDragging(true);
    initialY.current =
      'touches' in event ? event.touches[0].clientY : event.clientY;
  };

  const handleDragMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || isFilterOpen) return;

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

  // 인디케이터 클릭 시 하단으로 이동/올라오기
  const handleIndicatorClick = () => {
    setPosition(prevPosition =>
      prevPosition === maxDragDistance ? 0 : maxDragDistance
    );
  };

  // 바텀시트 열림 상태 변경 핸들러
  const handleToggleFilterOpen = (isOpen: boolean) => {
    setIsFilterOpen(isOpen);
    if (isOpen) {
      // 필터가 열리면 PopularSports의 위치를 초기화
      setPosition(0);
    }
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
      <div className={styles.indicatorWrapper} onClick={handleIndicatorClick}>
        <IconComponent
          name="indicator"
          width={58}
          height={4}
          alt="Drag Indicator"
        />
      </div>

      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.localFilterContainer}>
            <LocalFilter
              options={isNextStep ? currentOptions : cityCodes}
              value={isNextStep ? selectedLocalCode : selectedCityCode}
              onChange={handleValueChange}
              title={isNextStep ? '구/군 선택 (2/2)' : '시/도 선택 (1/2)'}
              placeholder={selectedRegion}
              onNextClick={handleNextClick}
              onCompleteClick={handleCompleteClick}
              isNextStep={isNextStep}
              additionalBottomSheetClass={styles.customBottomSheet}
              isSpecialMode={mode === 'special'}
              onToggleOpen={handleToggleFilterOpen}
            />
          </div>
        </header>

        <h2 className={styles.title}>인기 스포츠</h2>
        <SportButtonList
          sports={mode === 'general' ? generalSports : specialSports}
          onSelectSport={onSelectSport}
        />
      </div>
    </div>
  );
}
