export type ChipState =
  | 'checked'
  | 'unchecked'
  | 'label'
  | 'sports'
  | 'count'
  | 'top';

export interface ChipsProps {
  text: string | number | undefined;
  chipState: ChipState;
}
