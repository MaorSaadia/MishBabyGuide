export const cleanProductTitle = (productTitle: string): string => {
  return productTitle
    .replace(/\breview\b/i, "") // Remove the word "review"
    .replace(/\s+([:\-–—])/g, "$1") // FIX: Removes spaces before : - – —
    .replace(/[:\-–—]\s*$/g, "") // Remove trailing separators if left behind
    .trim(); // Clean up leading/trailing whitespace
};
