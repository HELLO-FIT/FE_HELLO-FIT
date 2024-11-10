// 수정중
import React from 'react';
import styles from './FacilityInfo.module.scss';

interface Facility {
  id: number;
  name: string;
  item_nm: string;
  location: string;
  address: string;
}

interface FacilityInfoProps {
  facility: Facility;
}

export default function FacilityInfo({ facility }: FacilityInfoProps) {
  return (
    <div className={styles.facilityInfoContainer}>
      <h3>{facility.name}</h3>
      <p>종목: {facility.item_nm}</p>
      <p>위치: {facility.location}</p>
      <p>주소: {facility.address}</p>
    </div>
  );
}
