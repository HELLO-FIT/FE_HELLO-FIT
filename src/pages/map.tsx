import LargeMap from '@/components/CourseDetails/LargeMap';
import Header from '@/components/Layout/Header';

export default function map() {
  return (
    <>
      <Header />
      <LargeMap address={''} />
    </>
  );
}
