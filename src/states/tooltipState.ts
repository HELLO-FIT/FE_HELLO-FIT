import { atom, selector } from 'recoil';

const getHasSeenTooltip = (): boolean => {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem('hasSeenTooltip') === 'true';
};

const setHasSeenTooltip = (value: boolean) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('hasSeenTooltip', value.toString());
  }
};

export const tooltipAtom = atom<boolean>({
  key: 'tootltipAtom',
  default: getHasSeenTooltip(),
  effects: [
    ({ onSet }) => {
      onSet(newValue => {
        setHasSeenTooltip(newValue);
      });
    },
  ],
});

export const tooltipSelector = selector<boolean>({
  key: 'tooltipSelector',
  get: ({ get }) => get(tooltipAtom),
});
