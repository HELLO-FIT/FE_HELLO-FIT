import { useRouter } from 'next/router';
import data from '@/components/Schedule/temp.json';
import Subheader from '@/components/Layout/Subheader';
import LargeMap from '@/components/CourseDetails/LargeMap';
import ButtonContainer from '@/components/ButtonContainer';

export default function Map() {
  const router = useRouter();
  const { id } = router.query;

  const Id = data.find(item => item.id === Number(id));
  return (
    <>
      <Subheader subheaderText="시설 상세" isGray={false} />
      {Id && <LargeMap address={Id.address} />}
      <ButtonContainer />
    </>
  );
}
