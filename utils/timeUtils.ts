/**
 * @description
 * Formats the time in seconds into a string in the format "MM:SS"
 * @param seconds - The time in seconds
 * @returns The formatted time
 */
export function formatTime(seconds: number): string {
  const sign = seconds < 0 ? "-" : "";
  const absSeconds = Math.abs(seconds);
  const minutes = Math.floor(absSeconds / 60);
  const remainingSeconds = absSeconds % 60;
  return `${sign}${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}