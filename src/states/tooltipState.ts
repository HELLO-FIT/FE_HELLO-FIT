import { atom } from 'recoil';

// 현재 날짜와 비교해서 하루에 한번 초기화
const initializeTooltip = (): boolean => {
  const lastVisit = localStorage.getItem('lastVisit');
  const currentDate = new Date().toISOString().split('T')[0];

  if (lastVisit !== currentDate) {
    localStorage.setItem('lastVisit', currentDate);
    localStorage.setItem('hasSeenTooltip', 'false');
    return false;
  }

  return localStorage.getItem('hasSeenTooltip') === 'true';
};

export const tooltipAtom = atom<boolean>({
  key: 'tooltipAtom',
  default: typeof window !== 'undefined' ? initializeTooltip() : true,
  effects: [
    ({ onSet }) => {
      onSet(newValue => {
        localStorage.setItem('hasSeenTooltip', newValue.toString());
      });
    },
  ],
});
