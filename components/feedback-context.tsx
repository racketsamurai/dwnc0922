"use client";

import { createContext, useContext, useState } from "react";
import type { FeedbackInput, FeedbackResult } from "@/types/feedback";

type FeedbackContextValue = {
  input: FeedbackInput | null;
  result: FeedbackResult | null;
  setFeedback: (input: FeedbackInput, result: FeedbackResult) => void;
  clearFeedback: () => void;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function FeedbackProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [input, setInput] = useState<FeedbackInput | null>(null);
  const [result, setResult] = useState<FeedbackResult | null>(null);

  return (
    <FeedbackContext.Provider
      value={{
        input,
        result,
        setFeedback: (nextInput, nextResult) => {
          setInput(nextInput);
          setResult(nextResult);
        },
        clearFeedback: () => {
          setInput(null);
          setResult(null);
        },
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const value = useContext(FeedbackContext);
  if (!value) throw new Error("useFeedback must be used inside FeedbackProvider.");
  return value;
}
