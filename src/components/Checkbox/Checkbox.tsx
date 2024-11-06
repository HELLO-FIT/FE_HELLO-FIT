import { useState } from 'react';
import IconComponent from '../Asset/Icon';
import styles from './Checkbox.module.scss';

export default function Checkbox() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <label className={styles.container}>
      <input
        type="checkbox"
        className={styles.checkboxInput}
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      <span className={styles.checkmark}>
        <div className={styles.unchecked}>
          <IconComponent
            name="unchecked"
            alt="checkbox-unchecked"
            width={20}
            height={20}
          />
        </div>
        <div className={styles.checked}>
          <IconComponent
            name="checked"
            alt="checkbox-checked"
            width={20}
            height={20}
          />
        </div>
      </span>
      커스텀 체크박스
    </label>
  );
}
