export function formattedDate(date: string | Date): string {
  const validDate = new Date(date);

  if (isNaN(validDate.getTime())) {
    throw new Error('Invalid date');
  }

  const year = validDate.getFullYear();
  const month = String(validDate.getMonth() + 1).padStart(2, '0');
  const day = String(validDate.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
}
