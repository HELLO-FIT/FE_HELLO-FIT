import SearchBar from '@/components/SearchBar/SearchBar';
import styles from './Lesson.module.scss';
import ImageComponent from '../Asset/Image';
import IconComponent from '../Asset/Icon';
import Schedule from '../Schedule';
import data from '@/components/Schedule/temp.json';
import Checkbox from '../Checkbox/Checkbox';

export default function Lesson() {
  const scheduleCount = data.length;

  return (
    <div className={styles.container}>
      <SearchBar />
      <div className={styles.popularBtn}>
        <div className={styles.leftContainer}>
          <ImageComponent
            name="popularImage"
            width={46}
            height={44}
            alt="인기 강좌 버튼 이미지"
          />
          <div className={styles.titleContainer}>
            <p className={styles.buttonSubtitle}>살펴보세요!</p>
            <p className={styles.buttonTitle}>우리 동네 인기 스포츠 강좌</p>
          </div>
        </div>
        <IconComponent name="right" size="l" />
      </div>
      <div className={styles.checkboxContainer}>
        <Checkbox>장애 지원 시설</Checkbox>
        <div className={styles.totalText}>
          총<p className={styles.totalTextColor}>{scheduleCount}</p>시설
        </div>
      </div>
      <div className={styles.listContainer}>
        {data.map(item => (
          <Schedule key={item.id} id={item.id} />
        ))}
      </div>
    </div>
  );
}
