import { useRouter } from 'next/router';
import { useSetRecoilState } from 'recoil';
import { authState } from '@/states/authState';
import { useModal } from '@/utils/modalUtils';
import styles from './Logout.module.scss';

export default function Logout() {
  const router = useRouter();
  const setAuth = useSetRecoilState(authState);
  const { openModal } = useModal();

  const handleLogout = async () => {
    if (window.Kakao?.Auth) {
      window.Kakao.Auth.logout(() => {
        console.log('카카오 로그아웃 완료');
      });
    }

    setAuth({
      access_token: '',
      isLoggedIn: false,
      email: '',
    });

    localStorage.removeItem('access_token');
    localStorage.removeItem('email');
    router.push('/map');
  };

  const showLogoutModal = () => {
    openModal({
      content: '로그아웃',
      onConfirm: handleLogout,
    });
  };

  return (
    <section
      onClick={showLogoutModal}
      className={`${styles.section} ${styles.cursor}`}
    >
      <p className={styles.logoutButton}>로그아웃</p>
    </section>
  );
}
