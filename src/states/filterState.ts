import { atom } from 'recoil';

export const selectedCityCodeState = atom<string>({
  key: 'selectedCityCodeState',
  default: '11', // 서울
});

export const selectedLocalCodeState = atom<string>({
  key: 'selectedLocalCodeState',
  default: '11110', // 서울 종로구
});

export const selectedSportState = atom<string>({
  key: 'selectedSportState',
  default: '',
});
