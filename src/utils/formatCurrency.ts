// 금액 단위 , 구분
export function formatCurrency(amount: string | number): string {
  const numericAmount =
    typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    console.error(`Invalid amount: ${amount}`);
    return '0';
  }

  return numericAmount.toLocaleString('ko-KR');
}
