import BASE_URL from '@/constants/baseurl';

export interface NotificationsItem {
  id: string;
  businessId: string;
  serialNumber?: string;
  facilityName: string;
  courseNames: string[];
  createdAt: Date;
  isViewed: boolean;
}

export async function getNotifications(): Promise<NotificationsItem[]> {
  try {
    const response = await BASE_URL.get<NotificationsItem[]>('/Notifications');
    return response.data;
  } catch (error) {
    console.error('Error fetching Notifications:', error);
    throw new Error('Failed to fetch Notifications');
  }
}
