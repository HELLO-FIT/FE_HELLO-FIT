export function hideNickname(nickname: string) {
  if (nickname.length <= 2) {
    return nickname;
  }

  const firstChar = nickname.charAt(0);
  const lastChar = nickname.charAt(nickname.length - 1);
  const maskedPart = '*'.repeat(nickname.length - 2);

  return `${firstChar}${maskedPart}${lastChar}`;
}
