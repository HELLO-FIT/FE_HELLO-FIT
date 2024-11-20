import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Notification from './Notification';
import styles from './Noti.module.scss';
import { putNotifications } from '@/apis/put/putNotifications';
import {
  getNotifications,
  NotificationsItem,
} from '@/apis/get/getNotifications';
import { deleteNotifications } from '@/apis/delete/deleteNotifications';
import LoadingSpinner from '../LoadingSpinner';
import { useModal } from '@/utils/modalUtils';
import IconComponent from '../Asset/Icon';

export default function Noti() {
  const [notifications, setNotifications] = useState<NotificationsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { openModal } = useModal();

  const showLoginModal = useCallback(() => {
    openModal({
      content: '로그인',
      onConfirm: () => (window.location.href = '/'),
      onClose: () => (window.location.href = '/map'),
    });
  }, [openModal]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      showLoginModal();
      return;
    }

    async function fetchNotifications() {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, [showLoginModal]);

  // 읽음 처리
  const markAsRead = async (id: string) => {
    try {
      const response = await putNotifications(id);
      if (response.success) {
        setNotifications(prevNotifications =>
          prevNotifications.map(notification =>
            notification.id === id
              ? { ...notification, isViewed: true }
              : notification
          )
        );
      } else {
        console.log(response.message);
      }
    } catch (error) {
      console.error('읽음 처리 중 오류가 발생했습니다.', error);
    }
  };

  // 삭제 처리
  const removeNotification = async (id: string) => {
    try {
      const response = await deleteNotifications(id);
      if (response.success) {
        setNotifications(prevNotifications =>
          prevNotifications.filter(notification => notification.id !== id)
        );
      } else {
        console.log(response.message);
      }
    } catch (error) {
      console.error('삭제 처리 중 오류가 발생했습니다.', error);
    }
  };

  // 모두 삭제 처리
  const removeAllNotifications = async () => {
    try {
      const deletePromises = notifications.map(notification =>
        deleteNotifications(notification.id)
      );
      const responses = await Promise.all(deletePromises);
      if (responses.every(res => res.success)) {
        setNotifications([]);
      } else {
        console.log('일부 알림 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('모두 삭제 처리 중 오류가 발생했습니다.', error);
    }
  };

  // 알림 클릭
  const handleNotificationClick = (
    businessId: string,
    serialNumber?: string
  ) => {
    const targetUrl = `/details/${businessId}/${serialNumber || ''}`;
    router.push(targetUrl);
  };

  // 읽은 알림 아래로 정렬하기 위해 분류
  const unreadNotifications = notifications.filter(noti => !noti.isViewed);
  const readNotifications = notifications.filter(noti => noti.isViewed);

  const showModal = () => {
    openModal({
      content: '모든 알림을 삭제',
      onConfirm: removeAllNotifications,
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.container}>
      {notifications.length > 0 ? (
        <>
          <header className={styles.header}>
            <div className={styles.titleCounterWrapper}>
              <h2 className={styles.title}>알림</h2>
              <p className={styles.counter}>{notifications.length}</p>
            </div>
            <button onClick={showModal} className={styles.removeAll}>
              모두 지우기
            </button>
          </header>
          <div className={styles.notiWrapper}>
            {unreadNotifications.map(notification => (
              <Notification
                key={notification.id}
                isRead={notification.isViewed}
                onClick={() => {
                  markAsRead(notification.id);
                  handleNotificationClick(
                    notification.businessId,
                    notification.serialNumber
                  );
                }}
                onDelete={() => removeNotification(notification.id)}
                notification={{
                  id: notification.id,
                  title: notification.facilityName,
                  content: notification.courseNames.join(' | '),
                  time: notification.createdAt,
                }}
              />
            ))}
            {readNotifications.map(notification => (
              <Notification
                key={notification.id}
                isRead={notification.isViewed}
                onClick={() =>
                  handleNotificationClick(
                    notification.businessId,
                    notification.serialNumber
                  )
                }
                onDelete={() => removeNotification(notification.id)}
                notification={{
                  id: notification.id,
                  title: notification.facilityName,
                  content: notification.courseNames.join(' | '),
                  time: notification.createdAt,
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <div className={styles.resultContainer}>
          <IconComponent
            name="emptyNoti"
            width={48}
            height={48}
            alt="알림 없음"
          />
          <div className={styles.textContainer}>
            <p className={styles.mainText}>현재 알림 내역이 없어요.</p>
            <p className={styles.subText}>관련 소식을 빠르게 들고올게요.</p>
          </div>
        </div>
      )}
    </div>
  );
}
