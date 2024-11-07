import data from '@/components/Schedule/temp.json';
import styles from './LikeList.module.scss';
import Schedule from '../Schedule';

export default function LikeList() {
  const scheduleCount = data.length;

  return (
    <div className={styles.container}>
      <header className={styles.headerContainer}>
        <h2 className={styles.title}>찜한 강좌</h2>
        <p className={styles.counter}>{scheduleCount}</p>
      </header>
      <div className={styles.listContainer}>
        {data.map(item => (
          <Schedule key={item.id} id={item.id} />
        ))}
      </div>
    </div>
  );
}
