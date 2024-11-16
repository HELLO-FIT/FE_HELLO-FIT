export type ChipState = 'checked' | 'unchecked' | 'label' | 'sports' | 'count';

export interface ChipsProps {
  text: string | number | undefined;
  chipState: ChipState;
}
