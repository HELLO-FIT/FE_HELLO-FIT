import ButtonContainer from '@/components/MapHome/ButtonContainer';
import CourseDetails from '@/components/CourseDetails';
import Subheader from '@/components/Layout/Subheader';
import { useRouter } from 'next/router';

// 특수 전용 페이지
export default function SpecialDetails() {
  const router = useRouter();
  const { businessId } = router.query;

  return (
    <>
      <Subheader subheaderText="시설 상세" />
      <CourseDetails businessId={businessId as string} />
      <ButtonContainer businessId={businessId as string} />
    </>
  );
}
