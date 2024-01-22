export default function generateAccountNumber(): number {
  return Math.floor(Math.random() * 9999999999) + 1;
}
