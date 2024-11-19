export interface TabNavProps {
  showmenu: boolean;
  tab: 'lesson' | 'popular';
  setSelectedTab: (tab: 'lesson' | 'popular') => void;
}
