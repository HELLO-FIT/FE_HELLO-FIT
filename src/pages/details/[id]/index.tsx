import ButtonContainer from '@/components/MapHome/ButtonContainer';
import CourseDetails from '@/components/CourseDetails';
import Subheader from '@/components/Layout/Subheader';
import data from '@/components/Schedule/temp.json';
import { useRouter } from 'next/router';

export default function Details() {
  const router = useRouter();
  const { id } = router.query;

  const Id = data.find(item => item.id === Number(id));

  return (
    <>
      <Subheader subheaderText="시설 상세" />
      {Id && <CourseDetails schedule={Id} />}
      <ButtonContainer />
    </>
  );
}
