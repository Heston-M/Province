import { loseMessages, winMessages } from "@/constants/quotes";

export type QuoteType = "win" | "lose";

/**
 * @description
 * Gets a random quote of the given type
 * @param type - The type of quote to get
 * @returns The quote
 */
export function useRandomQuote(type: QuoteType): string {
  if (type === "win") {
    return winMessages[Math.floor(Math.random() * winMessages.length)];
  } else {
    return loseMessages[Math.floor(Math.random() * loseMessages.length)];
  }
}