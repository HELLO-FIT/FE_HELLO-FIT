// 요일 정보 변환(1111100 -> 월,화,수,목,금)
export function getWeekdays(lectr_weekday_val: string): string {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  return lectr_weekday_val
    .split('')
    .map((val, idx) => (val === '1' ? days[idx] : ''))
    .filter(Boolean)
    .join(',');
}
