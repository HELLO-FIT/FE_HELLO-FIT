import styles from './CourseCard.module.scss';
import { formatCurrency } from '@/utils/formatCurrency';
import { CourseCardProps } from './CourseCard.types';

export default function CourseCard({
  courseName,
  instructor,
  startTime,
  endTime,
  workday,
  price,
  isNormal = true,
}: CourseCardProps) {
  return (
    <section className={styles.box}>
      <p className={styles.labelValue}>
        <span className={styles.label}>강좌명</span>
        <span className={isNormal ? styles.highlight : styles.highlightSP}>
          {courseName}
        </span>
      </p>
      {instructor && (
        <p className={styles.labelValue}>
          <span className={styles.label}>강사</span>
          <span className={styles.value}>{instructor}</span>
        </p>
      )}
      <p className={styles.labelValue}>
        <span className={styles.label}>시간</span>
        <span className={styles.value}>
          {startTime} ~ {endTime}
        </span>
      </p>
      <p className={styles.labelValue}>
        <span className={styles.label}>요일</span>
        <span className={styles.value}>{workday}</span>
      </p>
      <p className={styles.labelValue}>
        <span className={styles.label}>가격</span>
        <span className={styles.value}>{formatCurrency(price)}</span>
      </p>
    </section>
  );
}
