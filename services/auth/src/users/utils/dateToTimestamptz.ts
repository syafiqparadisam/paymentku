export default function parseDateToTimestamptz(): string {
  const date = new Date().toISOString();
  return date;
}
