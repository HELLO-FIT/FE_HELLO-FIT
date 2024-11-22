import styles from './SpecialInfoCard.module.scss';
import { SpecialInfoCardProps } from './SpecialInfoCard.types';
import { specialAmenityList } from '@/constants/specialList';

export default function SpecialInfoCard({ specialType }: SpecialInfoCardProps) {
  return (
    <section className={styles.box}>
      <div className={styles.labelValueText}>
        <span className={styles.label}>장애 특수 지도자</span>
        <span className={styles.value}>{2}명</span>
      </div>
      <div className={styles.labelValue}>
        <span className={styles.label}>장애 유형</span>
        <div className={styles.buttonContainer}>
          {specialType.map((type, index) => (
            <button key={index} className={styles.button}>
              {type}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.labelValue}>
        <span className={styles.label}>편의 시설</span>
        <div className={styles.buttonContainer}>
          {specialAmenityList.map((amenity, index) => (
            <button key={index} className={styles.button}>
              {amenity}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
