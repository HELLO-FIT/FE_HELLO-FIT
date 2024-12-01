import { atom } from 'recoil';

const generateUniqueKey = (key: string) =>
  process.env.NODE_ENV === 'production' ? key : `${key}_${Math.random()}`;

export const selectedCityCodeState = atom<string>({
  key: generateUniqueKey('selectedCityCodeState'),
  default: '11', // 서울
});

export const selectedLocalCodeState = atom<string>({
  key: generateUniqueKey('selectedLocalCodeState'),
  default: '11110', // 서울 종로구
});

export const selectedSportState = atom<string>({
  key: generateUniqueKey('selectedSportState'),
  default: '',
});
