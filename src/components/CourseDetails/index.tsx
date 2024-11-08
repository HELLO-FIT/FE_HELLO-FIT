import { useRouter } from 'next/router';
import styles from './CourseDetails.module.scss';
import { getWeekdays } from '@/utils/getWeekdays';
import { CourseDetailsProps } from './CourseDetails.types';
import Chips from '../Button/Chips';
import IconComponent from '../Asset/Icon';
import { formatCurrency } from '@/utils/formatCurrency';
import DetailsMap from './DetailsMap';

export default function CourseDetails({ schedule }: CourseDetailsProps) {
  const router = useRouter();
  const weekdays = getWeekdays(schedule.lectr_weekday_val);

  const handleMapClick = () => {
    router.push(`/details/${schedule.id}/map`);
  };

  return (
    <div className={styles.container}>
      <section className={styles.titleBtnSection}>
        <h1 className={styles.name}>{schedule.name}</h1>
        <Chips chipState="sports" text={schedule.item_nm} />
      </section>
      <div className={styles.infoContainer}>
        <div>
          <label className={styles.title}>위치</label>
          <div className={styles.mapContainer}>
            <DetailsMap address={schedule.address} radius={true} />
          </div>
          <div className={styles.addressWrapper} onClick={handleMapClick}>
            <div className={styles.address}>
              <IconComponent name="marker" width={16} height={16} />
              {schedule.address}
            </div>
            <div className={styles.rightIcon}>
              <IconComponent name="right" size="m" />
            </div>
          </div>
        </div>
        <div className={styles.labelSectionWrapper}>
          <label className={styles.title}>시설 정보</label>
          <section className={styles.box}>
            <p className={styles.labelValue}>
              <span className={styles.label}>연락처</span>
              <span className={styles.value}>{schedule.phone}</span>
            </p>
            <p className={styles.labelValue}>
              <span className={styles.label}>대표자</span>
              <span className={styles.value}>{schedule.lectr_nm}</span>
            </p>
          </section>
        </div>
        <div className={styles.labelSectionWrapper}>
          <label className={styles.title}>개설 강좌</label>
          <section className={styles.box}>
            <p className={styles.labelValue}>
              <span className={styles.label}>강좌명</span>
              <span className={styles.highlight}>{schedule.course_nm}</span>
            </p>
            <p className={styles.labelValue}>
              <span className={styles.label}>강사</span>
              <span className={styles.value}>{schedule.lectr_nm}</span>
            </p>
            <p className={styles.labelValue}>
              <span className={styles.label}>시간</span>
              <span className={styles.value}>
                {schedule.start_tm} ~ {schedule.close_tm}
              </span>
            </p>
            <p className={styles.labelValue}>
              <span className={styles.label}>요일</span>
              <span className={styles.value}>{weekdays}</span>
            </p>
            <p className={styles.labelValue}>
              <span className={styles.label}>가격</span>
              <span className={styles.value}>
                {formatCurrency(schedule.settl_amt)}
              </span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
