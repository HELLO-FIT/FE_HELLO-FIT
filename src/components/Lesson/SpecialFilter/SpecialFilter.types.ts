export interface SpecialFilterProps {
  types: string[];
  amenities: string[];
  value: string;
  onChange: (type: string, amenities: string[]) => void;
}
