import ButtonContainer from '@/components/MapHome/ButtonContainer';
import CourseDetails from '@/components/CourseDetails';
import Subheader from '@/components/Layout/Subheader';
import { useRouter } from 'next/router';
import { InitialPageMeta } from '@/components/MetaData';
import { SSRMetaProps } from '@/components/MetaData/MetaData.type';
import { serviceUrl } from '@/constants/serviceUrl';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  const OGTitle = '시설 상세 | HELLOFIT';
  const OGUrl = `${serviceUrl}/details`;
  return {
    props: {
      OGTitle,
      OGUrl,
    },
  };
};

// 특수 전용 페이지
export default function SpecialDetails({ OGTitle, OGUrl }: SSRMetaProps) {
  const router = useRouter();
  const { businessId } = router.query;

  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <Subheader subheaderText="시설 상세" />
      <CourseDetails businessId={businessId as string} />
      <ButtonContainer businessId={businessId as string} />
    </>
  );
}
