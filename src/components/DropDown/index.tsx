import React, { useState, useRef, useEffect } from 'react';
import styles from './DropDown.module.scss';
import IconComponent from '@/components/Asset/Icon';

interface DropDownProps {
  placeholder: string;
  options: string[];
  onSelect: (option: string) => void;
}

export default function DropDown({
  placeholder,
  options,
  onSelect,
}: DropDownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const dropDownRef = useRef<HTMLDivElement | null>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.dropDownContainer} ref={dropDownRef}>
      <button className={styles.dropDownButton} onClick={handleToggle}>
        <span className={styles.label}>
          {selectedOption || placeholder}{' '}
          {/* 선택한 값이 없을 경우 placeholder 표시 */}
        </span>
        <IconComponent
          name={isOpen ? 'up' : 'down'}
          size="m"
          alt="DropDown Icon"
        />
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
