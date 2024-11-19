import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/styles/globals.scss';
import '@/styles/reset.css';
import Header from '@/components/Layout/Header';
import { useRouter } from 'next/router';
import GNB from '@/components/Layout/GNB';
import {
  RecoilRoot,
  useRecoilTransactionObserver_UNSTABLE,
  useSetRecoilState,
} from 'recoil';
import Modal from '@/components/Modal';
import { authState } from '@/states/authState';
import { useEffect } from 'react';

const queryClient = new QueryClient();

// 새로고침 시 Recoil 초기화로 로그인 풀리는 이슈 해결 함수
// localStorage에서 로그인 정보를 불러와 Recoil 상태 설정
function InitializeAuthState() {
  const setAuth = useSetRecoilState(authState);

  useEffect(() => {
    const access_token = localStorage.getItem('access_token');
    const email = localStorage.getItem('email');

    if (access_token && email) {
      setAuth({
        access_token,
        isLoggedIn: true,
        email,
      });
    }
  }, [setAuth]);

  return null;
}

// Recoil 상태가 변경되면 access_token과 email을 localStorage에 저장하거나 제거함
function PersistAuthState() {
  useRecoilTransactionObserver_UNSTABLE(({ snapshot }) => {
    const auth = snapshot.getLoadable(authState).contents;

    if (auth.isLoggedIn) {
      localStorage.setItem('access_token', auth.access_token);
      localStorage.setItem('email', auth.email);
    } else {
      localStorage.removeItem('access_token');
      localStorage.removeItem('email');
    }
  });

  return null;
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const hideGNB = [
    '/',
    '/login',
    '/noti',
    '/details/[businessId]/[serialNumber]',
    '/details/[businessId]/[serialNumber]/map',
    '/setting',
    '/search',
  ].includes(router.pathname);
  const hideHeader = [
    '/',
    '/login',
    '/noti',
    '/likelist',
    '/lesson',
    '/map',
    '/details/[businessId]/[serialNumber]',
    '/details/[businessId]/[serialNumber]/map',
    '/setting',
    '/search',
    '/popular',
  ].includes(router.pathname);
  const withoutHeader = ['/', '/login'].includes(router.pathname);
  const tabNav = ['/lesson', '/popular'].includes(router.pathname);

  return (
    <RecoilRoot>
      <InitializeAuthState />
      <PersistAuthState />
      <QueryClientProvider client={queryClient}>
        <div className="body">
          <div
            className={`appContainer ${!hideGNB && 'withGNB'} ${
              withoutHeader && 'withoutHeader'
            } ${tabNav && 'tabNav'}`}
          >
            {!hideHeader && <Header />}
            <Component {...pageProps} />
            {!hideGNB && <GNB />}
          </div>
        </div>
        <Modal />
      </QueryClientProvider>
    </RecoilRoot>
  );
}
