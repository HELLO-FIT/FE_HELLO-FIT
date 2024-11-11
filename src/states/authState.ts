import { atom } from 'recoil';

export const authState = atom({
  key: 'authState',
  default: {
    access_token: '',
    isLoggedIn: false,
  },
});
