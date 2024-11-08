import styles from './InfoCard.module.scss';
import { InfoCardProps } from './InfoCard.types';

export default function InfoCard({ contact, representative }: InfoCardProps) {
  return (
    <section className={styles.box}>
      <p className={styles.labelValue}>
        <span className={styles.label}>연락처</span>
        <span className={styles.value}>{contact}</span>
      </p>
      <p className={styles.labelValue}>
        <span className={styles.label}>대표자</span>
        <span className={styles.value}>{representative}</span>
      </p>
    </section>
  );
}
