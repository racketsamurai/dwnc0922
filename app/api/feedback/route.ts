import { NextResponse } from "next/server";
import type { FeedbackInput, FeedbackResult, RequestPurpose } from "@/types/feedback";

const GEMINI_MODEL = "gemini-3.5-flash";
const purposes: RequestPurpose[] = ["결석 양해", "성적 관련 요청", "서명 요청", "기타"];

const responseSchema = {
  type: "OBJECT",
  properties: {
    overallReview: { type: "STRING" },
    sentenceSuggestions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { original: { type: "STRING" }, issue: { type: "STRING" }, suggestion: { type: "STRING" } },
        required: ["original", "issue", "suggestion"],
      },
    },
    revisedEmail: {
      type: "OBJECT",
      properties: { subject: { type: "STRING" }, body: { type: "STRING" } },
      required: ["subject", "body"],
    },
  },
  required: ["overallReview", "sentenceSuggestions", "revisedEmail"],
} as const;

function isInput(value: unknown): value is FeedbackInput {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.draft === "string" && candidate.draft.trim().length >= 10 && typeof candidate.context === "string" && purposes.includes(candidate.purpose as RequestPurpose);
}

function isFeedbackResult(value: unknown): value is FeedbackResult {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  const email = candidate.revisedEmail as Record<string, unknown> | undefined;
  return typeof candidate.overallReview === "string" && Array.isArray(candidate.sentenceSuggestions) && candidate.sentenceSuggestions.every((item) => {
    const suggestion = item as Record<string, unknown>;
    return suggestion && typeof suggestion.original === "string" && typeof suggestion.issue === "string" && typeof suggestion.suggestion === "string";
  }) && !!email && typeof email.subject === "string" && typeof email.body === "string";
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY가 설정되지 않았습니다. .env.local 파일을 확인해 주세요." }, { status: 500 });

  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 }); }
  if (!isInput(input)) return NextResponse.json({ error: "메일 초안과 요청 목적을 확인해 주세요." }, { status: 400 });

  const systemInstruction = `당신은 한국 대학생이 교수님께 보내는 요청 메일 전문 피드백 코치다. 목표는 학생이 공손하고, 명확하며, 원하는 바를 무리 없이 요청하게 하는 것이다. 반드시 한국어로 답한다. 제공된 초안과 맥락 밖의 사실, 날짜, 수업명, 이름을 만들어 내지 마라. 이름·수업명·날짜처럼 빠진 필수 정보는 [이름], [과목명], [날짜] 같은 대괄호 자리표시자로 남겨라. 수정본에는 제목, 정중한 인사, 간결한 요청, 감사와 맺음말을 포함한다. 문장별 제안은 원문에 실제로 있는 개선 대상만 0~5개 고른다. 고칠 부분이 없다면 sentenceSuggestions는 빈 배열로 반환한다. JSON 외의 텍스트, 마크다운, 코드 펜스를 절대 출력하지 마라.`;
  const userPrompt = `요청 목적: ${input.purpose}\n추가 맥락: ${input.context.trim() || "없음"}\n수신자: 교수님\n\n메일 초안:\n${input.draft.trim()}`;

  try {
    const geminiRequest = {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: { responseMimeType: "application/json", responseSchema, temperature: 0.35 },
      }),
    };
    let response: Response | undefined;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, geminiRequest);
      if (response.ok || (response.status !== 429 && response.status < 500) || attempt === 2) break;
      await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
    }
    if (!response) throw new Error("Gemini API 요청을 시작하지 못했습니다.");
    const geminiResponse = (await response.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>; error?: { message?: string } };
    if (!response.ok) throw new Error(geminiResponse.error?.message || "Gemini API 요청에 실패했습니다.");
    const outputText = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!outputText) throw new Error("Gemini가 결과를 반환하지 않았습니다.");
    const parsed: unknown = JSON.parse(outputText);
    if (!isFeedbackResult(parsed)) throw new Error("Gemini 응답 형식이 올바르지 않습니다.");
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "피드백 생성 중 오류가 발생했습니다.";
    const userMessage = message === "fetch failed"
      ? "Gemini 서버에 연결하지 못했습니다. 네트워크와 API 키 설정을 확인해 주세요."
      : message;
    return NextResponse.json({ error: userMessage }, { status: 502 });
  }
}
