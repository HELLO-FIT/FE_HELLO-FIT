import type { AppProps } from 'next/app';
import '@/styles/globals.scss';
import '@/styles/reset.css';
import GNB from '@/components/GNB';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const hideGNB = ['/', '/login'].includes(router.pathname);

  return (
    <div className="body">
      <div className="appContainer">
        <Component {...pageProps} />
        {!hideGNB && <GNB />}
      </div>
    </div>
  );
}
