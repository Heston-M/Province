/**
 * @description
 * Formats the time in seconds into a string in the format "MM:SS"
 * @param seconds - The time in seconds
 * @returns The formatted time
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}