// 금액 단위 , 구분
export function formatCurrency(amount: string | number | undefined): string {
  if (typeof amount === 'number') {
    return amount.toLocaleString('ko-KR');
  }
  if (typeof amount === 'string') {
    const numberValue = parseFloat(amount);
    return !isNaN(numberValue) ? numberValue.toLocaleString('ko-KR') : amount;
  }
  return '';
}
