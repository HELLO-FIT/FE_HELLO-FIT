import { useRouter } from 'next/router';
import Subheader from '@/components/Layout/Subheader';
import LargeMap from '@/components/CourseDetails/LargeMap';
import ButtonContainer from '@/components/MapHome/ButtonContainer';
import { InitialPageMeta } from '@/components/MetaData';
import { SSRMetaProps } from '@/components/MetaData/MetaData.type';
import { serviceUrl } from '@/constants/serviceUrl';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async context => {
  const { businessId } = context.params ?? {};
  const OGTitle = '시설 위치 상세 | HELLOFIT';
  const OGUrl = `${serviceUrl}/details/${businessId ?? ''}/map`;
  return {
    props: {
      OGTitle,
      OGUrl,
    },
  };
};

export default function SpecialMap({ OGTitle, OGUrl }: SSRMetaProps) {
  const router = useRouter();
  const { businessId } = router.query;

  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <Subheader subheaderText="시설 상세" isGray={false} />
      <LargeMap businessId={businessId as string} />
      <ButtonContainer businessId={businessId as string} />
    </>
  );
}
