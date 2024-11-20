import styles from './Schedule.module.scss';
import IconComponent from '../Asset/Icon';
import { ScheduleProps } from './Schedule.types';
import Chips from '../Button/Chips';

export default function Schedule({ facility, isPopular }: ScheduleProps) {
  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.storeName}>{facility.name}</h2>
        <div className={styles.information}>
          <p className={styles.location}>
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
          {isPopular && (
            <Chips text={facility.totalParticipantCount} chipState="count" />
          )}
        </div>
      </div>
      <IconComponent name="right" size="l" />
    </div>
  );
}
