import { atom } from 'recoil';

export const userCoordinatesState = atom<{
  latitude: number;
  longitude: number;
} | null>({
  key: 'userCoordinatesState',
  default: null,
});

export const userLocationCodeState = atom<string>({
  key: 'userLocationCodeState',
  default: '11110', // 초기값으로 기본 지역 코드 설정 (서울 종로구)
});
