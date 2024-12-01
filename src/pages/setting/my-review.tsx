import Subheader from '@/components/Layout/Subheader';
import MyReview from '@/components/Setting/MyReview';
import { authState } from '@/states/authState';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { InitialPageMeta } from '@/components/MetaData';
import { SSRMetaProps } from '@/components/MetaData/MetaData.type';
import { serviceUrl } from '@/constants/serviceUrl';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  const OGTitle = '작성 후기 | HELLOFIT';
  const OGUrl = `${serviceUrl}/setting/my-review`;
  return {
    props: {
      OGTitle,
      OGUrl,
    },
  };
};

export default function MyReviewPage({ OGTitle, OGUrl }: SSRMetaProps) {
  const auth = useRecoilValue(authState);
  const router = useRouter();

  useEffect(() => {
    // 로그인이 되어 있지 않으면 /map으로 이동
    if (!auth.isLoggedIn) {
      router.push('/map');
    }
  }, [auth.isLoggedIn, router]);

  // 로그인 상태 확인 중에는 렌더링을 멈춤
  if (!auth.isLoggedIn) {
    return null;
  }

  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <Subheader subheaderText="작성 후기" isGray={false} />
      <MyReview />
    </>
  );
}
