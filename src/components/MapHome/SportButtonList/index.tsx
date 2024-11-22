import React, { useState } from 'react';
import SportButton from '@/components/Button/SportButton';
import { ICONS } from '@/constants/asset';


interface SportButtonListProps {
  sports: { iconName: keyof typeof ICONS; label: string }[]; // 정확한 타입 지정
  onSelectSport: (sport: string) => void;
}

export default function SportButtonList({
  sports,
  onSelectSport,
}: SportButtonListProps) {
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  const handleSportClick = (label: string) => {
    const newSelection = selectedSport === label ? null : label; // 같은 버튼을 누르면 선택 해제
    setSelectedSport(newSelection);
    onSelectSport(newSelection || ''); // 선택 해제 시 빈 문자열 전달
  };

  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      {sports.map((sport, index) => (
        <SportButton
          key={index}
          iconName={sport.iconName}
          label={sport.label}
          isSelected={selectedSport === sport.label}
          onClick={() => handleSportClick(sport.label)}
        />
      ))}
    </div>
  );
}

