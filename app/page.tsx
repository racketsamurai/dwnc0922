"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFeedback } from "@/components/feedback-context";
import type { FeedbackInput, FeedbackResult, RequestPurpose } from "@/types/feedback";
import { getSampleFeedback } from "@/lib/sample-feedback";
import { MailEtiquette } from "@/components/mail-etiquette";

const purposes: RequestPurpose[] = ["결석 양해", "성적 관련 요청", "서명 요청", "기타"];

export default function HomePage() {
  const router = useRouter();
  const { setFeedback } = useFeedback();
  const [form, setForm] = useState<FeedbackInput>({ draft: "", purpose: "결석 양해", context: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSampleFallback, setShowSampleFallback] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.draft.trim()) {
      setFeedback(form, getSampleFeedback(form.purpose));
      router.push("/result");
      return;
    }

    setError("");
    setShowSampleFallback(false);
    setIsLoading(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as FeedbackResult | { error?: string };
      if (!response.ok || !("overallReview" in data)) {
        throw new Error("error" in data ? data.error : "피드백을 생성하지 못했습니다.");
      }
      setFeedback(form, data);
      router.push("/result");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "잠시 후 다시 시도해 주세요.");
      setShowSampleFallback(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="intro">
        <p className="eyebrow">AI WRITING FEEDBACK COACH</p>
        <h1 className="wordmark"><span>Mail Drill</span><Image className="drill-logo" src="/mail-drill-logo.png" alt="봉투를 관통하는 드릴" width={144} height={96} priority /></h1>
        <p className="tagline">교수님께 드릴 메일, 더 정확히 예의를 갖추세요.</p>
        <p className="intro-description">초안의 목적과 맥락을 알려주시면 총평, 문장별 제안, 보낼 수 있는 수정본을 드립니다.</p>
      </section>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="draft">메일 초안 <small>선택</small></label>
          <textarea id="draft" value={form.draft} onChange={(e) => setForm({ ...form, draft: e.target.value })} placeholder="초안을 붙여넣거나 비워 두면 목적별 모범 답안을 보여드립니다." rows={12} />
        </div>
        <div className="two-columns">
          <div className="field">
            <label htmlFor="purpose">요청 목적</label>
            <select id="purpose" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value as RequestPurpose })}>
              {purposes.map((purpose) => <option key={purpose}>{purpose}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="recipient">수신자</label>
            <input id="recipient" value="교수님" disabled />
          </div>
        </div>
        <div className="field">
          <label htmlFor="context">추가 맥락 <small>선택</small></label>
          <input id="context" value={form.context} onChange={(e) => setForm({ ...form, context: e.target.value })} placeholder="예: 9월 25일 수업 / 병원 진료 / 운영체제" />
        </div>
        {error && <p className="error-message" role="alert">{error}</p>}
        <button className="primary-button" type="submit" disabled={isLoading}>{isLoading ? "피드백 작성 중…" : form.draft.trim() ? "피드백 받기" : "모범 답안 보기"}</button>
      </form>
      <MailEtiquette />
      {showSampleFallback && <div className="modal-backdrop" role="presentation"><section className="sample-modal" role="dialog" aria-modal="true" aria-labelledby="fallback-title"><p className="eyebrow">ALTERNATIVE</p><h2 id="fallback-title">AI 피드백을 불러오지 못했습니다.</h2><p>초안에 고칠 부분이 거의 없거나 연결 상태에 따라 결과 생성이 어려울 수 있습니다. 선택한 목적의 모범 답안을 바로 확인할 수 있습니다.</p><div className="modal-actions"><button className="secondary-button" type="button" onClick={() => setShowSampleFallback(false)}>닫기</button><button className="primary-button" type="button" onClick={() => { setFeedback(form, getSampleFeedback(form.purpose)); router.push("/result"); }}>모범 답안 보기</button></div></section></div>}
    </main>
  );
}
