import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './Login.module.scss';
import IconComponent from '@/components/Asset/Icon';
import BASE_URL from '@/constants/baseurl';

interface AuthObj {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: string;
  token_type: string;
}

interface ErrorResponse {
  error: string;
  error_description: string;
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const APP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;

  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(APP_KEY);
    }

    window.Kakao.Auth.login({
      success: async (authObj: AuthObj) => {
        try {
          const response = await BASE_URL.post('/auth/login', {
            kakaoAccessToken: authObj.access_token,
          });

          localStorage.setItem('access_token', authObj.access_token);
          router.push('/map');
        } catch (error) {
          console.error('로그인 실패:', error);
        } finally {
          setLoading(false);
        }
      },
      fail: (error: ErrorResponse) => {
        console.error('로그인 실패:', error);
        setLoading(false);
      },
    });
  };

  return (
    <div
      className={styles.kakaoBtn}
      onClick={handleLogin}
      role="button"
      tabIndex={0}
      aria-disabled={loading}
    >
      <div className={styles.kakaoIcon}>
        <IconComponent
          name="landingKakao"
          alt="Kakao Icon"
          width={24}
          height={24}
        />
      </div>
      {loading ? '로그인 중...' : '카카오로 계속하기'}
    </div>
  );
}
