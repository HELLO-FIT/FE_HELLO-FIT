import Subheader from '@/components/Layout/Subheader';
import { useRouter } from 'next/router';
import { InitialPageMeta } from '@/components/MetaData';
import { SSRMetaProps } from '@/components/MetaData/MetaData.type';
import { serviceUrl } from '@/constants/serviceUrl';
import { GetServerSideProps } from 'next';
import ReviewEdit from '@/components/CourseDetails/ReviewEdit';

export const getServerSideProps: GetServerSideProps = async context => {
  const { businessId, serialNumber, reviewId } = context.params ?? {};

  const OGTitle = '후기 수정 | HELLOFIT';
  const OGUrl = `${serviceUrl}/details/${businessId}/${serialNumber}/review/${reviewId}`;
  return {
    props: {
      OGTitle,
      OGUrl,
    },
  };
};

export default function ReviewEditPage({ OGTitle, OGUrl }: SSRMetaProps) {
  const router = useRouter();
  const { reviewId } = router.query;

  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <Subheader subheaderText="후기 수정" />
      <ReviewEdit reviewId={reviewId as string} isNormal={false} />
    </>
  );
}
