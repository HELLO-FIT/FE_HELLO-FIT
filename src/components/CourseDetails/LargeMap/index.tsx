import DetailsMap from '../DetailsMap';
import styles from './LargeMap.module.scss';
import { LargeMapProps } from './LargeMap.types';

export default function LargeMap({ address }: LargeMapProps) {
  return (
    <div className={styles.container}>
      <DetailsMap address={address} />
    </div>
  );
}
