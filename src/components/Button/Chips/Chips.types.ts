export type ChipState = 'checked' | 'unchecked' | 'label' | 'sports';

export interface ChipsProps {
  text: string;
  chipState: ChipState;
}
