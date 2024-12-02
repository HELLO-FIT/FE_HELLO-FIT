import Subheader from '@/components/Layout/Subheader';
import { useRouter } from 'next/router';
import { InitialPageMeta } from '@/components/MetaData';
import { SSRMetaProps } from '@/components/MetaData/MetaData.type';
import { serviceUrl } from '@/constants/serviceUrl';
import { GetServerSideProps } from 'next';
import ReviewWrite from '@/components/CourseDetails/ReviewWrite';

export const getServerSideProps: GetServerSideProps = async context => {
  const { businessId, serialNumber } = context.params ?? {};

  const OGTitle = '후기 작성 | HELLOFIT';
  const OGUrl = `${serviceUrl}/details/${businessId}/${serialNumber}/review`;
  return {
    props: {
      OGTitle,
      OGUrl,
    },
  };
};

export default function ReviewWritePage({ OGTitle, OGUrl }: SSRMetaProps) {
  const router = useRouter();
  const { businessId } = router.query;

  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <Subheader subheaderText="후기 작성" />
      <ReviewWrite businessId={businessId as string} />
    </>
  );
}
