import React from 'react';
import SportButton from '@/components/Button/SportButton';
import styles from './SportButtonList.module.scss';

const sportsData = [
  { icon: '/icon/custom/logo-blue.svg', label: '길이제한일단안둠' },
  { icon: '/icon/custom/logo-green.svg', label: '합기도' },
  { icon: '/icon/custom/logo-blue.svg', label: '복싱' },
  { icon: '/icon/custom/logo-green.svg', label: '헬스' },
  { icon: '/icon/custom/logo-blue.svg', label: '필라테스' },
  // 다섯개까지만 노출됨
  { icon: '/path/to/icon6.svg', label: '성혜' }, 
];

export default function SportButtonList() {
  return (
    <div className={styles.sportButtonList}>
      {sportsData.slice(0, 5).map((sport, index) => (
        <SportButton key={index} icon={sport.icon} label={sport.label} />
      ))}
    </div>
  );
}
