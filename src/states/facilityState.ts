import { atom } from 'recoil';
import { Facility } from '@/apis/get/getFacilities';

export const facilityState = atom<Facility[]>({
  key: 'facilityState',
  default: [],
});
