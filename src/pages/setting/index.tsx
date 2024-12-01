import Subheader from '@/components/Layout/Subheader';
import Setting from '@/components/Setting';
import { authState } from '@/states/authState';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { InitialPageMeta } from '@/components/MetaData';
import { SSRMetaProps } from '@/components/MetaData/MetaData.type';
import { serviceUrl } from '@/constants/serviceUrl';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  const OGTitle = '설정 | HELLOFIT';
  const OGUrl = `${serviceUrl}/setting`;
  return {
    props: {
      OGTitle,
      OGUrl,
    },
  };
};

export default function SettingPage({ OGTitle, OGUrl }: SSRMetaProps) {
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
      <Subheader subheaderText="설정" isGray={false} />
      <Setting />
    </>
  );
}
