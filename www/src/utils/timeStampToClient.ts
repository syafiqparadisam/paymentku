export default function timeStampToLocaleString(
  s: string | number | Date
): string {
  // Tanggal dan waktu UTC
  const utcDate = new Date(s); // contoh waktu UTC spesifik
  const localDate = utcDate.toLocaleString();

  return localDate;
}
