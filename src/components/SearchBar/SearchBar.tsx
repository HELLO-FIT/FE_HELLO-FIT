import IconComponent from '../Asset/Icon';
import styles from './SearchBar.module.scss';

export default function SearchBar() {
  return (
    <div className={styles.container}>
      <IconComponent name="search" size="m" />
      <input
        className={styles.inputContainer}
        type="text"
        placeholder="스포츠 강좌 검색하기"
      />
    </div>
  );
}
