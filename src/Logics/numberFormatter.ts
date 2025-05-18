export default function formatNumberString(input: string): string {
  // Remove any non-digit characters (in case)
  const cleaned = input.replace(/\D/g, '');

  // Add thousands separator using a regular expression
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
