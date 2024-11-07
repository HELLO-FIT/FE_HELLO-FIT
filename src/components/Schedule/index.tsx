import data from './temp.json';
import styles from './Schedule.module.scss';
import { getWeekdays } from '@/utils/getWeekdays';
import IconComponent from '../Asset/Icon';
import { ScheduleProps } from './Schedule.types';
import { ScheduleItem } from '@/types/types';

export default function Schedule({ id }: ScheduleProps) {
  const item: ScheduleItem | undefined = data.find(d => d.id === id);

  if (!item) {
    return <div>해당 데이터를 찾을 수 없습니다.</div>;
  }

  const weekdays = getWeekdays(item.lectr_weekday_val);

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.storeName}>{item.name}</h2>
        <div className={styles.information}>
          <p className={styles.location}>{item.location}</p>
          <IconComponent name="scheduleEllipse" width={2} height={2} />
          {item.lectr_nm}
          <IconComponent name="scheduleEllipse" width={2} height={2} />
          {weekdays}
        </div>
      </div>
      <IconComponent name="right" size="l" />
    </div>
  );
}
