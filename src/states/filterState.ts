import { atom } from 'recoil';

export const selectedCityCodeState = atom<string>({
  key: 'selectedCityCodeState',
  default: '11', // 서울
});

export const selectedLocalCodeState = atom<string>({
  key: 'selectedLocalCodeState',
  default: '11680', // 서울 강남구
});

export const selectedSportState = atom<string>({
  key: 'selectedSportState',
  default: '',
});

export const scrollState = atom({
  key: 'scrollPositionState',
  default: 0,
});
