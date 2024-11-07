import IconComponent from '@/components/Asset/Icon';
import styles from './Notification.module.scss';
import { NotificationProps } from './Notification.types';

export default function Notification({
  isRead,
  onClick,
  notification,
}: NotificationProps) {
  return (
    <div
      className={`${styles.container} ${isRead ? styles.read : ''}`}
      onClick={onClick}
    >
      <div>
        <div className={styles.title}>
          <IconComponent name="notification" size="s" />
          <div className={styles.message}>
            찜한 강좌 [<p className={styles.storeName}>{notification.title}</p>
            ]가 개설되었어요!
          </div>
        </div>
        <p className={styles.information}>{notification.content}</p>
      </div>
      <div className={styles.rightContainer}>
        <IconComponent name="x" size="s" />
        <p className={styles.leftTime}>{notification.time}</p>
      </div>
    </div>
  );
}
