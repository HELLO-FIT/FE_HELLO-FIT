import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useSetRecoilState } from 'recoil';
import { authState } from '@/states/authState';
import { useModal } from '@/utils/modalUtils';
import styles from './DeleteAccount.module.scss';
import BASE_URL from '@/constants/baseurl';

export default function DeleteAccount() {
  const router = useRouter();
  const setAuth = useSetRecoilState(authState);
  const { openModal } = useModal();

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return BASE_URL.delete('/users');
    },
    onSuccess: () => {
      setAuth({
        access_token: '',
        isLoggedIn: false,
        email: '',
      });
      localStorage.removeItem('access_token');
      localStorage.removeItem('email');
      router.push('/');
    },
    onError: error => {
      console.error('회원 탈퇴 실패:', error);
      alert('회원 탈퇴 중 문제가 발생했습니다. 다시 시도해주세요.');
    },
  });

  const showDeleteAccountModal = () => {
    openModal({
      content: '회원 탈퇴',
      onConfirm: () => deleteAccountMutation.mutate(),
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
