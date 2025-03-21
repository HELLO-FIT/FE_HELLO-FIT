import { ICONS } from '@/constants/asset';

type Sport = {
  iconName: keyof typeof ICONS;
  label: string;
};

// 일반 스포츠 데이터
export const generalSports: Sport[] = [
  { iconName: 'taekwondo', label: '태권도' },
  { iconName: 'boxing', label: '복싱' },
  { iconName: 'hapkido', label: '합기도' },
  { iconName: 'health', label: '헬스' },
  { iconName: 'pilates', label: '필라테스' },
];

// 특수 스포츠 데이터
export const specialSports: Sport[] = [
  { iconName: 'health', label: '헬스' },
  { iconName: 'tabletennis', label: '탁구' },
  { iconName: 'taekwondo', label: '태권도' },
  { iconName: 'bowling', label: '볼링' },
  { iconName: 'swimming', label: '수영' },
];
