import Subheader from '@/components/Layout/Subheader';
import Search from '@/components/Search';
import { InitialPageMeta } from '@/components/MetaData';
import { SSRMetaProps } from '@/components/MetaData/MetaData.type';
import { serviceUrl } from '@/constants/serviceUrl';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async context => {
  const query = context.query.query as string | undefined;
  const OGTitle = query
    ? `${query} 검색 결과 | HELLOFIT`
    : '검색 결과 | HELLOFIT';
  const OGUrl = `${serviceUrl}/search${query ? `?query=${query}` : ''}`;

  return {
    props: {
      OGTitle,
      OGUrl,
    },
  };
};

export default function SearchPage({ OGTitle, OGUrl }: SSRMetaProps) {
  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <Subheader subheaderText="시설 검색" />
      <Search />
    </>
  );
}
