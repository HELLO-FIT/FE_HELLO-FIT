import IconComponent from '@/components/Asset/Icon';
import styles from './Preview.module.scss';

export default function Preview() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Icon Preview</h2>

      <div>
        <p>Sizes: Small, Medium, Large</p>
        <div className={styles.iconGroup}>
          <IconComponent name="search" size="s" />
          <IconComponent name="search" size="m" />
          <IconComponent name="search" size="l" />
        </div>
      </div>

      <hr className={styles.section} />

      <div>
        <p>Custom Sizes:</p>
        <div className={styles.iconGroup}>
          <IconComponent name="blueHeartBlank" width={36} height={36} />
          <IconComponent name="kakao" alt="Kakao logo" width={48} height={48} />
        </div>
      </div>
    </div>
  );
}
