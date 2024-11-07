export type ChipState = 'checked' | 'unchecked' | 'label';

export interface ChipsProps {
  text: string;
  chipState: ChipState;
}
