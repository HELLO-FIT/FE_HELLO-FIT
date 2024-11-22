import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import IconComponent from '../../Asset/Icon';
import styles from './SearchBar.module.scss';
import { SearchBarProps } from './SearchBar.types';
import { toggleState } from '@/states/toggleState';
import { useRecoilValue } from 'recoil';

export default function SearchBar({ searchCase }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const toggle = useRecoilValue(toggleState);

  useEffect(() => {
    if (router.query.query) {
      setSearchTerm(String(router.query.query));
    }
  }, [router.query.query]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      if (searchCase === 'replace') {
        router.replace(`/search?query=${encodeURIComponent(searchTerm)}`);
      } else {
        router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div
      className={toggle === 'general' ? styles.container : styles.containerSP}
    >
      <IconComponent name="search" size="m" />
      <input
        className={styles.inputContainer}
        type="text"
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="스포츠 강좌 검색하기"
      />
    </div>
  );
}
