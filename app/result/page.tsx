"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFeedback } from "@/components/feedback-context";

export default function ResultPage() {
  const router = useRouter();
  const { result, clearFeedback } = useFeedback();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!result) router.replace("/");
  }, [result, router]);

  if (!result) return null;
  const emailText = `제목: ${result.revisedEmail.subject}\n\n${result.revisedEmail.body}`;

  async function copyEmail() {
    await navigator.clipboard.writeText(emailText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="page-shell result-shell">
      <header className="result-header">
        <div><p className="eyebrow">FEEDBACK RESULT</p><h1>메일을 검토했습니다.</h1></div>
        <Link className="text-link" href="/" onClick={clearFeedback}>다시 작성하기</Link>
      </header>
      <section className="result-card"><p className="card-label">총평</p><p className="overall-review">{result.overallReview}</p></section>
      {result.sentenceSuggestions.length > 0 && <section className="result-section"><div className="section-heading"><p className="card-label">문장별 개선 제안</p><span>{result.sentenceSuggestions.length}건</span></div>
        <div className="suggestion-list">{result.sentenceSuggestions.map((item, index) => <article className="suggestion-card" key={`${item.original}-${index}`}><p className="suggestion-number">{String(index + 1).padStart(2, "0")}</p><div><p className="original-text">{item.original}</p><p className="issue-text">{item.issue}</p><p className="suggested-text">{item.suggestion}</p></div></article>)}</div>
      </section>}
      <section className="result-card final-email"><div className="final-email-heading"><div><p className="card-label">수정본</p><p>복사 후 <strong>[이름]</strong> 등 대괄호 정보를 채워 보내세요.</p></div><button className="secondary-button" onClick={copyEmail}>{copied ? "복사됨" : "전체 복사"}</button></div><div className="email-content"><p><strong>제목:</strong> {result.revisedEmail.subject}</p><p>{result.revisedEmail.body}</p></div></section>
    </main>
  );
}
