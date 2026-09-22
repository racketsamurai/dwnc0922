export type RequestPurpose = "결석 양해" | "성적 관련 요청" | "서명 요청" | "기타";

export type FeedbackInput = {
  draft: string;
  purpose: RequestPurpose;
  context: string;
};

export type SentenceSuggestion = {
  original: string;
  issue: string;
  suggestion: string;
};

export type FeedbackResult = {
  overallReview: string;
  sentenceSuggestions: SentenceSuggestion[];
  revisedEmail: {
    subject: string;
    body: string;
  };
};
