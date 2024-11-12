import { useRecoilValue } from 'recoil';
import { authState } from '@/states/authState';
import SubheaderWithLogo from '@/components/Layout/SubheaderWithLogo';
import Lesson from '@/components/Lesson';

export default function LessonPage() {
  const auth = useRecoilValue(authState);

  return (
    <>
      <SubheaderWithLogo showMenu={auth.isLoggedIn} />
      <Lesson />
    </>
  );
}
