import ButtonContainer from '@/components/MapHome/ButtonContainer';
import CourseDetails from '@/components/CourseDetails';
import Subheader from '@/components/Layout/Subheader';
import { useRouter } from 'next/router';

export default function Details() {
  const router = useRouter();
  const { businessId, serialNumber } = router.query;

  return (
    <>
      <Subheader subheaderText="시설 상세" />
      <CourseDetails
        businessId={businessId as string}
        serialNumber={serialNumber as string}
      />
      <ButtonContainer
        businessId={businessId as string}
        serialNumber={serialNumber as string}
      />
    </>
  );
}
