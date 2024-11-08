import React from 'react';
import DropDown from '@/components/DropDown';
import SportButtonList from '@/components/SportButtonList';
import styles from './PopularSports.module.scss';
import IconComponent from '../Asset/Icon';

const locationOptions = [
  '서울 종로구',
  '서울 중구',
  '서울 용산구',
  '서울 성동구',
  '서울 광진구',
  '서울 동대문구',
  '서울 중랑구',
  '서울 성북구',
  '서울 강북구',
  '서울 도봉구',
  '서울 노원구',
  '서울 은평구',
  '서울 서대문구',
  '서울 마포구',
  '서울 양천구',
  '서울 강서구',
  '서울 구로구',
  '서울 금천구',
  '서울 영등포구',
  '서울 동작구',
  '서울 관악구',
  '서울 서초구',
  '서울 강남구',
  '서울 송파구',
  '서울 강동구',
];

export default function PopularSports() {
  return (
    <div className={styles.popularSportsContainer}>
      <div className={styles.indicatorContainer}>
        <IconComponent name="indicator" size="custom" alt="Indicator" />
      </div>
      <header className={styles.header}>
        <DropDown
          placeholder="지역"
          options={locationOptions}
          onSelect={selectedLocation =>
            console.log('선택된 위치:', selectedLocation)
          }
        />
      </header>

      <h2 className={styles.title}>인기 스포츠</h2>

      <SportButtonList />
    </div>
  );
}
