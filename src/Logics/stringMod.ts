export function getFirstWord(input: string): string {
    // Split the string by whitespace and return the first element
    const words = input.trim().split(/\s+/);
    return words[0] || '';
}