import { loseMessages, winMessages } from "@/constants/quotes";

export type QuoteType = "win" | "lose";

export function useRandomQuote(type: QuoteType) {
  if (type === "win") {
    return winMessages[Math.floor(Math.random() * winMessages.length)];
  } else {
    return loseMessages[Math.floor(Math.random() * loseMessages.length)];
  }
}