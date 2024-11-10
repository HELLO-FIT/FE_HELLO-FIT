import { atom } from 'recoil';

const loadToggleState = (): 'general' | 'special' => {
  if (typeof window !== 'undefined') {
    const savedState = localStorage.getItem('toggleState');
    return savedState === 'special' ? 'special' : 'general';
  }
  return 'general';
};

export const toggleState = atom<'general' | 'special'>({
  key: 'toggleState',
  default: loadToggleState(),
});
