export function formatPhoneNumber(phone: string | null | undefined) {
  // phone이 null 또는 undefined일 경우
  if (!phone) {
    return '-';
  }

  if (phone.length === 11) {
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  } else if (phone.length === 10) {
    // 지역 번호가 2자리일 경우 (예: 02-xxxx-xxxx)
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
  } else if (phone.length === 9) {
    // 지역 번호가 2자리일 경우 (예: 031-xxx-xxxx)
    return phone.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
  } else if (phone.length === 8) {
    // 특수 번호 처리 (예: 1577-xxxx)
    return phone.replace(/(\d{4})(\d{4})/, '$1-$2');
  }

  return phone; // 위의 조건을 만족하지 않는 경우 그대로 반환
}
