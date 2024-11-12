import styles from './Schedule.module.scss';
import IconComponent from '../Asset/Icon';
import { Facility } from '@/apis/get/getFacilities';

interface ScheduleProps {
  facility: Facility;
}

export default function Schedule({ facility }: ScheduleProps) {
  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.storeName}>{facility.name}</h2>
        <div className={styles.information}>
          <p className={styles.location}>
            {facility.cityName} {facility.localName}
          </p>
          <IconComponent name="scheduleEllipse" width={2} height={2} />
          {facility.items.map((item, index) => (
            <span key={index}>
              {item}
              {index < facility.items.length - 1 && ', '}
            </span>
          ))}
        </div>
      </div>
      <IconComponent name="right" size="l" />
    </div>
  );
}
