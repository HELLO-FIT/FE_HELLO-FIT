export interface CourseCardProps {
  courseName: string;
  instructor?: string;
  startTime: string;
  endTime: string;
  workday: string;
  price: number;
  isNormal?: boolean;
}
