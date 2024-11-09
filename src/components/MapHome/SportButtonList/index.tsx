import React from 'react';
import SportButton from '@/components/Button/SportButton';
import { ICONS } from '@/constants/asset'; 

const sportsData: { iconName: keyof typeof ICONS; label: string }[] = [
  { iconName: 'logoBlue', label: '태권도' },
  { iconName: 'boxing', label: '복싱' },
  { iconName: 'hapkido', label: '합기도' },
  { iconName: 'health', label: '헬스' },
  { iconName: 'pilates', label: '필라테스' },
  { iconName: 'search', label: '검색' },
];

export default function SportButtonList() {
  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      {sportsData.slice(0, 5).map((sport, index) => (
        <SportButton key={index} iconName={sport.iconName} label={sport.label} />
      ))}
    </div>
  );
}
