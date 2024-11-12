export interface FilterProps {
  options: { [key: string]: string };
  value: string;
  onChange: (value: string) => void;
  title?: string;
  placeholder?: string;
  onNextClick?: () => void;
  onCompleteClick?: () => void;
  isNextStep?: boolean;
}
