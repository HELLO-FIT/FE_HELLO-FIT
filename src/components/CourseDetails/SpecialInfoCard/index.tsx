import styles from './SpecialInfoCard.module.scss';
import { SpecialInfoCardProps } from './SpecialInfoCard.types';

export default function SpecialInfoCard({
  coach,
  vehicle = false,
  specialType,
  amenities,
}: SpecialInfoCardProps) {
  return (
    <section className={styles.box}>
      <p className={styles.labelValueText}>
        <span className={styles.label}>장애 특수 지도자</span>
        <span className={styles.value}>{coach}명</span>
      </p>
      <p className={styles.labelValueText}>
        <span className={styles.label}>차량 지원</span>
        <span className={styles.value}>{vehicle ? '지원' : '없음'}</span>
      </p>
      <p className={styles.labelValue}>
        <span className={styles.label}>장애 유형</span>
        <div className={styles.buttonContainer}>
          {specialType.map((type, index) => (
            <button key={index} className={styles.button}>
              {type}
            </button>
          ))}
        </div>
      </p>
      <p className={styles.labelValue}>
        <span className={styles.label}>편의 시설</span>
        <div className={styles.buttonContainer}>
          {amenities.map((facility, index) => (
            <button key={index} className={styles.button}>
              {facility}
            </button>
          ))}
        </div>
      </p>
    </section>
  );
}
