import styles from './Setting.module.scss';
import DeleteAccount from '../Auth/DeleteAccount';
import Logout from '../Auth/Logout';
import { useEffect, useState } from 'react';
import { getProfile, ProfileResponse } from '@/apis/get/getProfile';

export default function Setting() {
  const [profile, setProfile] = useState<ProfileResponse>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.log('찜한 강좌를 가져오는데 실패했습니다.', err);
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      fetchProfile();
    }
  }, [loading]);

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <p>계정정보</p>
        <div>
          <p className={styles.subtext}>
            SNS 로그인({profile?.provider || '정보 없음'})
          </p>
          <p className={styles.subtext}>
            {profile?.email || '이메일 정보 없음'}
          </p>
        </div>
      </section>
      <DeleteAccount />
      <Logout />
    </div>
  );
}
