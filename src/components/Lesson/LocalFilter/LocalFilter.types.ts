export interface LocalFilterProps {
  options: { [key: string]: string };
  value: string;
  onChange: (value: string) => void;
  title?: string;
  placeholder?: string;
  onNextClick?: () => void;
  onCompleteClick?: () => void;
  isNextStep?: boolean;
  placeholderType?: string; // 지도 탭과 강좌 탭 페이지에 따른 드롭다운 요소 디자인 차이 구분용
  additionalBottomSheetClass?: string;
  isSpecialMode?: boolean;
}
