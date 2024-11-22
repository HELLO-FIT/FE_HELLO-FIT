export interface NotificationProps {
  isRead: boolean;
  onClick: () => void;
  onDelete: () => void;
  notification: {
    id: string;
    title: string;
    content: string;
    time: Date;
    isGeneral: string | undefined;
  };
}
