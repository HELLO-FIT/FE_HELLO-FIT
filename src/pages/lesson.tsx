import { useRecoilValue } from 'recoil';
import { authState } from '@/states/authState';
import Lesson from '@/components/Lesson';
import TabNav from '@/components/Layout/TabNav';

export default function LessonPage() {
  const auth = useRecoilValue(authState);

  return (
    <>
      <TabNav showmenu={auth.isLoggedIn} />
      <Lesson />
    </>
  );
}
