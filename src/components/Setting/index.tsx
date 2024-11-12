import { useRouter } from 'next/router';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authState } from '@/states/authState';
import styles from './Setting.module.scss';
import { useModal } from '@/utils/modalUtils';

export default function Setting() {
  const router = useRouter();
  const setAuth = useSetRecoilState(authState);
  const auth = useRecoilValue(authState);
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
    router.push('/map');
  };

  const handleDeleteAccount = async () => {
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
    router.push('/map');
  };

  const showLogoutModal = () => {
    openModal({
      content: '로그아웃',
      onConfirm: handleLogout,
    });
  };

  const showDeleteAccountModal = () => {
    openModal({
      content: '회원 탈퇴',
      onConfirm: handleDeleteAccount,
    });
  };

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <p>계정정보</p>
        <div>
          <p className={styles.subtext}>SNS 로그인(카카오)</p>
          <p className={styles.subtext}>{auth.email || '이메일 정보 없음'}</p>
        </div>
      </section>
      <section
        onClick={showDeleteAccountModal}
        className={`${styles.section} ${styles.cursor}`}
      >
        <p>회원탈퇴</p>
      </section>
      <section
        onClick={showLogoutModal}
        className={`${styles.section} ${styles.cursor}`}
      >
        <p className={styles.logoutButton}>로그아웃</p>
      </section>
    </div>
  );
}
