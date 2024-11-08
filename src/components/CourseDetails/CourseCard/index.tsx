import styles from './CourseCard.module.scss';
import { formatCurrency } from '@/utils/formatCurrency';
import { getWeekdays } from '@/utils/getWeekdays';
import { CourseCardProps } from './CourseCard.types';

export default function CourseCard({
  courseName,
  instructor,
  startTime,
  endTime,
  weekdays,
  price,
  isSpecial = false,
}: CourseCardProps) {
  const weekdaysKR = getWeekdays(weekdays);

  return (
    <section className={styles.box}>
      <p className={styles.labelValue}>
        <span className={styles.label}>강좌명</span>
        <span className={styles.highlight}>{courseName}</span>
      </p>
      <p className={styles.labelValue}>
        <span className={styles.label}>강사</span>
        <span className={styles.value}>{instructor}</span>
      </p>
      <p className={styles.labelValue}>
        <span className={styles.label}>시간</span>
        <span className={styles.value}>
          {startTime} ~ {endTime}
        </span>
      </p>
      <p className={styles.labelValue}>
        <span className={styles.label}>요일</span>
        <span className={styles.value}>{weekdaysKR}</span>
      </p>
      {isSpecial && (
        <p className={styles.labelValue}>
          <span className={styles.label}>대상</span>
          <span className={styles.value}>지체, 시각</span>
        </p>
      )}
      <p className={styles.labelValue}>
        <span className={styles.label}>가격</span>
        <span className={styles.value}>{formatCurrency(price)}</span>
      </p>
    </section>
  );
}
