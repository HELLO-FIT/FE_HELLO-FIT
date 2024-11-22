import styles from './PopularSchedule.module.scss';
import { useRecoilValue } from 'recoil';
import { toggleState } from '@/states/toggleState';
import IconComponent from '@/components/Asset/Icon';
import Chips from '@/components/Button/Chips';
import { PopularScheduleProps } from './PopularSchedule.types';

export default function PopularSchedule({ facility }: PopularScheduleProps) {
  const toggle = useRecoilValue(toggleState);
  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.storeName}>{facility.name}</h2>
        <div className={styles.information}>
          <p
            className={
              toggle === 'general' ? styles.location : styles.locationSP
            }
          >
            {facility.cityName} {facility.localName}
          </p>
          <IconComponent name="scheduleEllipse" width={2} height={2} />
          <p>{currentMonth}월</p>
          <IconComponent name="scheduleEllipse" width={2} height={2} />
          {facility.items.map((item, index) => (
            <span key={index} className={styles.count}>
              {item}
              {index < facility.items.length - 1 && ', '}
            </span>
          ))}
          <Chips
            text={facility.totalParticipantCount}
            chipState="count"
            serialNumber
          />
        </div>
      </div>
      <IconComponent name="right" size="l" />
    </div>
  );
}
