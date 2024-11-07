import { ChipsProps } from './Chips.types';
import styles from './Chips.module.scss';

export default function Chips({ text }: ChipsProps) {
  return <div className={styles.container}>{text}</div>;
}
