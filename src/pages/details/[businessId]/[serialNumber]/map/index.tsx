import { useRouter } from 'next/router';
import Subheader from '@/components/Layout/Subheader';
import LargeMap from '@/components/CourseDetails/LargeMap';
import ButtonContainer from '@/components/MapHome/ButtonContainer';

export default function Map() {
  const router = useRouter();
  const { businessId, serialNumber } = router.query;

  return (
    <>
      <Subheader subheaderText="시설 상세" isGray={false} />
      <LargeMap
        businessId={businessId as string}
        serialNumber={serialNumber as string}
      />
      <ButtonContainer />
    </>
  );
}
