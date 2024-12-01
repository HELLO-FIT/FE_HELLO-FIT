export interface ReviewCardProps {
  businessId: string;
  serialNumber?: string;
  averageScore: number;
  reviews: Array<{
    id: string;
    userId: string;
    nickname: string;
    score: number;
    content: string;
    createdAt: Date;
    isMine: boolean;
  }>;
}
