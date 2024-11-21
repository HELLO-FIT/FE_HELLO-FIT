import styles from './SpecialInfoCard.module.scss';
import { SpecialInfoCardProps } from './SpecialInfoCard.types';

const data = {
  coach: 2,
  vehicle: false,
  specialType: ['지체', '시각', '언어'],
  amenities: ['장애인 화장실', '장애인 주차구역', '휠체어 경사로'],
};

export default function SpecialInfoCard() {
  return (
    <section className={styles.box}>
      <div className={styles.labelValueText}>
        <span className={styles.label}>장애 특수 지도자</span>
        <span className={styles.value}>{data.coach}명</span>
      </div>
      <div className={styles.labelValueText}>
        <span className={styles.label}>차량 지원</span>
        <span className={styles.value}>{data.vehicle ? '지원' : '없음'}</span>
      </div>
      <div className={styles.labelValue}>
        <span className={styles.label}>장애 유형</span>
        <div className={styles.buttonContainer}>
          {data.specialType.map((type, index) => (
            <button key={index} className={styles.button}>
              {type}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.labelValue}>
        <span className={styles.label}>편의 시설</span>
        <div className={styles.buttonContainer}>
          {data.amenities.map((facility, index) => (
            <button key={index} className={styles.button}>
              {facility}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
