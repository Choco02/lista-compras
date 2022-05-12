export default function useFormatPrice(value: string | number): string {
  return `${Number(value).toFixed(2)}`;
}
