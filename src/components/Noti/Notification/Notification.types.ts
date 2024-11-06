export interface NotificationProps {
  isRead: boolean;
  onClick: () => void;
  notification: {
    id: number;
    title: string;
    content: string;
    time: string;
    isRead: boolean;
  };
}
