import { getWeekdays } from '@/utils/getWeekdays';
import data from './temp.json';
import IconComponent from '../Asset/Icon';
import styles from './schedule.module.scss';

export default function Schedule() {
  const weekdays = getWeekdays(data.lectr_weekday_val);

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.storeName}>{data.name}</h2>
        <div className={styles.information}>
          <p className={styles.location}>{data.location}</p>
          <IconComponent name="scheduleEllipse" width={2} height={2} />
          {data.lectr_nm}
          <IconComponent name="scheduleEllipse" width={2} height={2} />
          {weekdays}
        </div>
      </div>
      <IconComponent name="right" size="l" />
    </div>
  );
}
