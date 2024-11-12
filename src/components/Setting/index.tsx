import { useRecoilValue } from 'recoil';
import { authState } from '@/states/authState';
import styles from './Setting.module.scss';
import DeleteAccount from '../Auth/DeleteAccount';
import Logout from '../Auth/Logout';

export default function Setting() {
  const auth = useRecoilValue(authState);

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <p>계정정보</p>
        <div>
          <p className={styles.subtext}>SNS 로그인(카카오)</p>
          <p className={styles.subtext}>{auth.email || '이메일 정보 없음'}</p>
        </div>
      </section>
      <DeleteAccount />
      <Logout />
    </div>
  );
}
