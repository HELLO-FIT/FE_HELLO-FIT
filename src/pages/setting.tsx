import Subheader from '@/components/Layout/Subheader';
import Setting from '@/components/Setting';
import { authState } from '@/states/authState';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

export default function SettingPage() {
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
      <Subheader subheaderText="설정" isGray={false} />
      <Setting />
    </>
  );
}
