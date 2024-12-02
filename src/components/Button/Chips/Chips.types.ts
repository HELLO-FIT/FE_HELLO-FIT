export type ChipState =
  | 'checked'
  | 'unchecked'
  | 'label'
  | 'sports'
  | 'count'
  | 'top'
  | 'like'
  | 'average';

export interface ChipsProps {
  text: string | number | undefined;
  chipState: ChipState;
  serialNumber: boolean;
}
