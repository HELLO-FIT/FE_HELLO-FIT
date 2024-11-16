import TabNav from '@/components/Layout/TabNav';
import Popular from '@/components/Lesson/Popular';
import { authState } from '@/states/authState';
import { useRecoilValue } from 'recoil';

export default function PopularPage() {
  const auth = useRecoilValue(authState);

  return (
    <>
      <TabNav showmenu={auth.isLoggedIn} />
      <Popular />
    </>
  );
}
