import { useState } from 'react';
import Notification from './Notification/Notification';
import styles from './Noti.module.scss';
import { NotificationData } from './Noti.types';

const data: NotificationData[] = [
  {
    id: 1,
    title: '어쩌고저쩌고저쩌고',
    content: '“게시글 내용 첫줄 15글자”',
    time: '28분 전',
    isRead: false,
  },
  {
    id: 2,
    title: '조혜진 짱',
    content: '“게시글 내용 첫줄 15글자”',
    time: '28분 전',
    isRead: false,
  },
  {
    id: 3,
    title: '삼성라이온즈 우승',
    content: '“게시글 내용 첫줄 15글자”',
    time: '1시간 전',
    isRead: true,
  },
  {
    id: 4,
    title: '알림 4',
    content: '“게시글 내용 첫줄 15글자”',
    time: '1시간 전',
    isRead: true,
  },
];

export default function Noti() {
  const [notifications, setNotifications] = useState<NotificationData[]>(data);

  const markAsRead = (id: number) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>모두 지우기</div>
      <div className={styles.notiWrapper}>
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            isRead={notification.isRead}
            onClick={() => markAsRead(notification.id)}
            notification={notification}
          />
        ))}
      </div>
    </div>
  );
}
