import type { AppProps } from 'next/app';
import '@/styles/globals.scss';
import '@/styles/reset.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="body">
      <div className="appContainer">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
