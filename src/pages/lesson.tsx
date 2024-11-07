import SubheaderWithLogo from '@/components/Layout/SubheaderWithLogo';
import Lesson from '@/components/Lesson';

export default function lesson() {
  return (
    <>
      <SubheaderWithLogo showMenu={false} />
      <Lesson />
    </>
  );
}
