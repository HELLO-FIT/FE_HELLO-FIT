import { ChipsProps, ChipState } from './Chips.types';
import styles from './Chips.module.scss';
import { formatCurrency } from '@/utils/formatCurrency';
import { useRecoilValue } from 'recoil';
import { toggleState } from '@/states/toggleState';

export default function Chips({ chipState, text }: ChipsProps) {
  const toggle = useRecoilValue(toggleState);

  const getChipClass = (state: ChipState) => {
    switch (state) {
      case 'checked':
        return toggle === 'general' ? styles.checked : styles.checkedSP; // 'general'일 때는 checked, 아니면 checkedSP
      case 'unchecked':
        return styles.unchecked; // 체크되지 않은 칩
      case 'sports':
        return toggle === 'general' ? styles.sports : styles.sportsSP; // 'general'일 때는 sports, 아니면 sportsSP
      case 'count':
        return styles.count; // 누적 수강 수
      case 'top':
        return toggle === 'general' ? styles.top : styles.topSP; // 'general'일 때는 top, 아니면 topSP
      case 'label':
      default:
        return styles.label; // 기본 라벨 칩
    }
  };

  return (
    <div className={`${styles.container} ${getChipClass(chipState)}`}>
      {chipState === 'count' ? `누적 수강 ${formatCurrency(text)}` : text}
    </div>
  );
}
