import React, { useState } from 'react';
import SportButton from '@/components/Button/SportButton';
import { ICONS } from '@/constants/asset';

const sportsData: { iconName: keyof typeof ICONS; label: string }[] = [
  { iconName: 'logoBlue', label: '태권도' },
  { iconName: 'boxing', label: '복싱' },
  { iconName: 'hapkido', label: '합기도' },
  { iconName: 'health', label: '헬스' },
  { iconName: 'pilates', label: '필라테스' },
];

interface SportButtonListProps {
  onSelectSport: (sport: string) => void; // 선택된 스포츠 종목을 전달
}

export default function SportButtonList({ onSelectSport }: SportButtonListProps) {
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  const handleSportClick = (label: string) => {
    const newSelection = selectedSport === label ? null : label; // 같은 버튼을 누르면 선택 해제
    setSelectedSport(newSelection);
    onSelectSport(newSelection || ''); // 선택 해제 시 빈 문자열 전달
  };

  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      {sportsData.map((sport, index) => (
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
