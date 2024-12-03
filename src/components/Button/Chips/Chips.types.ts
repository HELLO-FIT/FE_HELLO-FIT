export type ChipState =
  | 'checked'
  | 'unchecked'
  | 'label'
  | 'sports'
  | 'count'
  | 'countHigh'
  | 'top'
  | 'like'
  | 'average';

export interface ChipsProps {
  text: string | number | undefined;
  chipState: ChipState;
  serialNumber: boolean;
}
