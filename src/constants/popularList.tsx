import { ICONS } from '@/constants/asset';

type Sport = {
  iconName: keyof typeof ICONS;
  label: string;
};

// 미등록 아이콘은 일단 로고 처리
// 일반 스포츠 데이터
export const generalSports: Sport[] = [
  { iconName: 'logoBlue', label: '태권도' },
  { iconName: 'boxing', label: '복싱' },
  { iconName: 'hapkido', label: '합기도' },
  { iconName: 'health', label: '헬스' },
  { iconName: 'pilates', label: '필라테스' },
];

// 특수 스포츠 데이터
export const specialSports: Sport[] = [
  { iconName: 'health', label: '헬스' },
  { iconName: 'logoGreen', label: '탁구' },
  { iconName: 'logoGreen', label: '태권도' },
  { iconName: 'logoGreen', label: '볼링' },
  { iconName: 'logoGreen', label: '수영' },
];
