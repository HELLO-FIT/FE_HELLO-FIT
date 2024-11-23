import Head from 'next/head';
import { InitialPageMetaProps, DetailsPageMetaProps } from './MetaData.type';
import { serviceUrl } from '@/constants/serviceUrl';

export function DetailsPageMeta({
  title,
  description,
  currentUrl,
}: DetailsPageMetaProps) {
  return (
    <Head>
      <title>{`${title} | HELLOFIT`}</title>
      <meta property="og:title" content={`${title} | HELLOFIT`} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />
    </Head>
  );
}

export function InitialPageMeta({ title, url }: InitialPageMetaProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content="지도기반 스포츠 강좌 정보 제공 서비스 헬로핏"
      />
      <meta property="og:image" content="/image/hellofit.png" />
      <meta property="og:url" content={url ?? serviceUrl} />
      <meta property="og:type" content="website" />
    </Head>
  );
}
