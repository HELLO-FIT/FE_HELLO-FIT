export interface DetailsPageMetaProps {
  title?: string;
  description?: string;
  currentUrl?: string;
}
export interface InitialPageMetaProps {
  title: string;
  url?: string;
}

export interface SSRMetaProps {
  OGTitle: string;
  OGUrl: string;
}
