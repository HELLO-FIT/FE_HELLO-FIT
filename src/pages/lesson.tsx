import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from '@/states/authState';
import Lesson from '@/components/Lesson';
import TabNav from '@/components/Layout/TabNav';
import Popular from '@/components/Lesson/Popular';

export default function LessonPage() {
  const auth = useRecoilValue(authState);
  const [selectedTab, setSelectedTab] = useState<'lesson' | 'popular'>(
    'lesson'
  );

  const handlePopularBtnClick = () => {
    setSelectedTab('popular');
  };

  return (
    <>
      {auth.isLoggedIn ? (
        <TabNav
          showmenu={true}
          tab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      ) : (
        <TabNav
          showmenu={false}
          tab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}
      {selectedTab === 'lesson' ? (
        <Lesson onPopularClick={handlePopularBtnClick} />
      ) : (
        <Popular />
      )}
    </>
  );
}
