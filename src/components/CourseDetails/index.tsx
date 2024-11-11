import { useRouter } from 'next/router';
import styles from './CourseDetails.module.scss';
import { CourseDetailsProps } from './CourseDetails.types';
import Chips from '../Button/Chips';
import IconComponent from '../Asset/Icon';
import DetailsMap from './DetailsMap';
import CourseCard from './CourseCard';
import InfoCard from './InfoCard';

export default function CourseDetails({ schedule }: CourseDetailsProps) {
  const router = useRouter();

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
              <IconComponent name="addressMarker" width={16} height={16} />
              {schedule.address}
            </div>
            <div className={styles.rightIcon}>
              <IconComponent name="right" size="m" />
            </div>
          </div>
        </div>
        <div className={styles.labelSectionWrapper}>
          <label className={styles.title}>시설 정보</label>
          <InfoCard
            contact={schedule.phone}
            representative={schedule.lectr_nm}
          />
        </div>
        <div className={styles.labelSectionWrapper}>
          <label className={styles.title}>개설 강좌</label>
          <CourseCard
            courseName={schedule.course_nm}
            instructor={schedule.lectr_nm}
            startTime={schedule.start_tm}
            endTime={schedule.close_tm}
            weekdays={schedule.lectr_weekday_val}
            price={schedule.settl_amt}
          />
        </div>
      </div>
    </div>
  );
}
