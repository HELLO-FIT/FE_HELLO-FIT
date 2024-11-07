import React, { useState } from 'react';
import styles from './DropDown.module.scss';
import IconComponent from '@/components/Asset/Icon';

export default function DropDown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("서울 종로구");

  // 목업 데이터 
  const options = [
    "서울 종로구", "서울 중구", "서울 용산구", "서울 성동구", "서울 광진구", 
    "서울 동대문구", "서울 중랑구", "서울 성북구", "서울 강북구", "서울 도봉구", 
    "서울 노원구", "서울 은평구", "서울 서대문구", "서울 마포구", "서울 양천구", 
    "서울 강서구", "서울 구로구", "서울 금천구", "서울 영등포구", "서울 동작구", 
    "서울 관악구", "서울 서초구", "서울 강남구", "서울 송파구", "서울 강동구"
  ];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    console.log('Selected Region:', option);
  };

  return (
    <div className={styles.dropDownContainer}>
      <button className={styles.dropDownButton} onClick={handleToggle}>
        <span className={styles.label}>{selectedOption}</span>
        <IconComponent name={isOpen ? "up" : "down"} size="m" alt="DropDown Icon" />
      </button>
      {isOpen && (
        <div className={styles.dropDownMenu}>
          {options.map((option, index) => (
            <div
              key={index}
              className={styles.dropDownItem}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
