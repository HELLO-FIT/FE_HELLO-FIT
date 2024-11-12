import React, { useState, useRef, useEffect } from 'react';
import styles from './DropDown.module.scss';
import IconComponent from '@/components/Asset/Icon';

interface DropDownProps {
  placeholder: string;
  options: string[];
  onSelect: (option: string) => void;
  onOpen?: () => void; 
  onClose?: () => void; 
}

export default function DropDown({
  placeholder,
  options,
  onSelect,
  onOpen,
  onClose,
}: DropDownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const dropDownRef = useRef<HTMLDivElement | null>(null);

  const handleToggle = () => {
    if (!isOpen && onOpen) onOpen(); 
    if (isOpen && onClose) onClose(); 
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
    if (onClose) onClose(); 
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        if (onClose) onClose(); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={styles.dropDownContainer} ref={dropDownRef}>
      <button className={styles.dropDownButton} onClick={handleToggle}>
        <span className={styles.label}>
          {selectedOption || placeholder}
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
