import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import { authState } from '@/states/authState';
import Lesson from '@/components/Lesson';
import TabNav from '@/components/Layout/TabNav';
import Popular from '@/components/Lesson/Popular';
import { GetServerSideProps } from 'next';
import { serviceUrl } from '@/constants/serviceUrl';
import { SSRMetaProps } from '@/components/MetaData/MetaData.type';
import { InitialPageMeta } from '@/components/MetaData';

export const getServerSideProps: GetServerSideProps = async context => {
  const tab = context.query.tab as 'lesson' | 'popular' | undefined;
  const OGTitle =
    tab === 'popular' ? '인기 시설 | HELLOFIT' : '강좌 | HELLOFIT';
  const OGUrl = `${serviceUrl}/lesson${tab ? `?tab=${tab}` : ''}`;
  return {
    props: {
      OGTitle,
      OGUrl,
    },
  };
};

export default function LessonPage({ OGTitle, OGUrl }: SSRMetaProps) {
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

  // 클라이언트에서 제목 동적으로 설정
  useEffect(() => {
    const newTitle =
      selectedTab === 'popular' ? '인기 시설 | HELLOFIT' : '강좌 | HELLOFIT';
    document.title = newTitle;
  }, [selectedTab]);

  const handleTabClick = (tab: 'lesson' | 'popular') => {
    setSelectedTab(tab);
    router.push({
      pathname: '/lesson',
      query: { tab: tab },
    });
  };

  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
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
