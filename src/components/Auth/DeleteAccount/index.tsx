import { useRouter } from 'next/router';
import { useSetRecoilState } from 'recoil';
import { authState } from '@/states/authState';
import { useModal } from '@/utils/modalUtils';
import styles from './DeleteAccount.module.scss';

export default function DeleteAccount() {
  const router = useRouter();
  const setAuth = useSetRecoilState(authState);
  const { openModal } = useModal();

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

  const showDeleteAccountModal = () => {
    openModal({
      content: '회원 탈퇴',
      onConfirm: handleDeleteAccount,
    });
  };

  return (
    <section
      onClick={showDeleteAccountModal}
      className={`${styles.section} ${styles.cursor}`}
    >
      <p>회원탈퇴</p>
    </section>
  );
}
