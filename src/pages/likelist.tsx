import SubheaderWithLogo from '@/components/Layout/SubheaderWithLogo';
import LikeList from '@/components/LikeList';
import { InitialPageMeta } from '@/components/MetaData';
import { SSRMetaProps } from '@/components/MetaData/MetaData.type';
import { serviceUrl } from '@/constants/serviceUrl';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  const OGTitle = '찜 | HELLOFIT';
  const OGUrl = `${serviceUrl}/likelist`;
  return {
    props: {
      OGTitle,
      OGUrl,
    },
  };
};

export default function likelist({ OGTitle, OGUrl }: SSRMetaProps) {
  return (
    <>
      <InitialPageMeta title={OGTitle} url={OGUrl} />
      <SubheaderWithLogo />
      <LikeList />
    </>
  );
}
