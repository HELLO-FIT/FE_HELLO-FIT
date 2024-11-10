import Head from 'next/head';
import Landing from '@/components/Landing';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { authState } from '@/states/authState';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const isLoggedIn = useRecoilValue(authState);

  // 로그인 한 상태에서 랜딩 페이지 접속 불가
  useEffect(() => {
    if (isLoggedIn && router.pathname === '/') {
      router.push('/map');
    }
  }, [isLoggedIn, router]);

  return (
    <>
      <Head>
        <title>헬로핏</title>
        <meta name="description" content="Hello Fit" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="../../public/favicon.ico" />
      </Head>
      <Landing />
    </>
  );
}
