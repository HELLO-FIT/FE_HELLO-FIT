import IconComponent from '@/components/Asset/Icon';
import styles from './Notification.module.scss';
import { NotificationProps } from './Notification.types';
import { timeAgo } from '@/utils/timeAgo';

export default function Notification({
  isRead,
  onClick,
  onDelete,
  notification,
}: NotificationProps) {
  return (
    <div className={`${styles.container} ${isRead && styles.read}`}>
      <div className={styles.content} onClick={onClick}>
        <div className={styles.title}>
          <IconComponent name="notification" size="s" />
          <div className={styles.message}>
            [<p className={styles.storeName}>{notification.title}</p>
            ]의 강좌가 개설되었어요!
          </div>
        </div>
        <p className={styles.information}>{notification.content}</p>
      </div>
      <div className={styles.rightContainer}>
        <div
          className={styles.deleteButton}
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
          role="button"
          tabIndex={0}
        >
          <IconComponent name="x" size="s" />
        </div>
        <p className={styles.leftTime}>{timeAgo(notification.time)}</p>
      </div>
    </div>
  );
}
