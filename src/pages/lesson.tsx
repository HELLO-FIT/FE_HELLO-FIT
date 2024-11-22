import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import { authState } from '@/states/authState';
import Lesson from '@/components/Lesson';
import TabNav from '@/components/Layout/TabNav';
import Popular from '@/components/Lesson/Popular';

export default function LessonPage() {
  const auth = useRecoilValue(authState);
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'lesson' | 'popular'>(
    'lesson'
  );

  // URL에서 tab 값을 가져와서 상태에 반영
  useEffect(() => {
    const { query } = router;
    if (query.tab) {
      setSelectedTab(query.tab as 'lesson' | 'popular');
    }
  }, [router, router.query]);

  const handleTabClick = (tab: 'lesson' | 'popular') => {
    setSelectedTab(tab);
    router.push({
      pathname: '/lesson',
      query: { tab: tab },
    });
  };

  return (
    <>
      {auth.isLoggedIn ? (
        <TabNav showmenu={true} tab={selectedTab} />
      ) : (
        <TabNav showmenu={false} tab={selectedTab} />
      )}
      {selectedTab === 'lesson' ? (
        <Lesson onPopularClick={() => handleTabClick('popular')} />
      ) : (
        <Popular />
      )}
    </>
  );
}
