import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './Login.module.scss';
import IconComponent from '@/components/Asset/Icon';
import { useMutation } from '@tanstack/react-query';
import BASE_URL from '@/constants/baseurl';
import { useRecoilState } from 'recoil';
import { authState } from '@/states/authState';

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
  const router = useRouter();
  const [auth, setAuth] = useRecoilState(authState);
  const APP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;

  const loginMutation = useMutation({
    mutationFn: async (accessToken: string) => {
      const response = await BASE_URL.post('/auth/login', {
        kakaoAccessToken: accessToken,
      });
      return response.data;
    },
    onSuccess: data => {
      setAuth({
        access_token: data.access_token,
        isLoggedIn: true,
      });
      localStorage.setItem('access_token', data.access_token);
      router.push('/map');
    },
    onError: (error: ErrorResponse) => {
      console.error('로그인 실패:', error);
      setLoading(false);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleLogin = async () => {
    setLoading(true);

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(APP_KEY);
    }

    window.Kakao.Auth.login({
      success: (authObj: AuthObj) => {
        loginMutation.mutate(authObj.access_token);
      },
      fail: (err: ErrorResponse) => {
        console.error('로그인 실패:', err);
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
