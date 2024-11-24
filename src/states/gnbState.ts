import { atom } from 'recoil';

export const gnbVisibilityState = atom<boolean>({
  key: 'gnbVisibilityState',
  default: true,
});
