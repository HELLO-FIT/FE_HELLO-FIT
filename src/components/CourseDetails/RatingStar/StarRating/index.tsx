import styled from '@emotion/styled';
import StarInput from '../StarInput';

interface StarRatingProps {
  currentRating: number;
  onRatingChange: (value: number) => void;
  isNormal: boolean;
}

const Base = styled.section<{ isNormal: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RatingField = styled.fieldset<{ isNormal: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  border: none;
  transform: translateY(2px);

  input:checked ~ label,
  label:hover,
  label:hover ~ label {
    transition: 0.2s;
    color: ${({ isNormal }) => (isNormal ? '#75abff' : '#76c663')};
  }
`;

export default function StarRating({
  currentRating,
  onRatingChange,
  isNormal,
}: StarRatingProps) {
  return (
    <Base isNormal={isNormal}>
      <RatingField isNormal={isNormal}>
        {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5].map(value => (
          <StarInput
            key={value}
            onClickRating={onRatingChange}
            value={value}
            isHalf={value % 1 !== 0}
          />
        ))}
      </RatingField>
    </Base>
  );
}
