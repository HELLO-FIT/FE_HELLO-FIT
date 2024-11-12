import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/styles/globals.scss';
import '@/styles/reset.css';
import Header from '@/components/Layout/Header';
import { useRouter } from 'next/router';
import GNB from '@/components/Layout/GNB';
import { RecoilRoot } from 'recoil';
import Modal from '@/components/Modal/Modal';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const hideGNB = [
    '/',
    '/login',
    '/noti',
    '/details/[id]',
    '/details/[id]/map',
    '/setting',
  ].includes(router.pathname);
  const hideHeader = [
    '/',
    '/login',
    '/noti',
    '/likelist',
    '/lesson',
    '/map',
    '/details/[id]',
    '/details/[id]/map',
    '/setting',
  ].includes(router.pathname);
  const withoutHeader = ['/', '/login'].includes(router.pathname);

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <div className="body">
          <div
            className={`appContainer ${!hideGNB ? 'withGNB' : ''} ${
              withoutHeader ? 'withoutHeader' : ''
            }`}
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
