import IconComponent from '../Asset/Icon';
import styles from './SearchBar.module.scss';

export default function SearchBar() {
  return (
    <div className={styles.container}>
      <IconComponent name="search" size="m" />
      <input className={styles.inputContainer} type="text" />
    </div>
  );
}
