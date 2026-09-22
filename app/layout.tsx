import type { Metadata } from "next";
import { FeedbackProvider } from "@/components/feedback-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mail Drill | AI 글 피드백 코치",
  description: "교수님께 드릴 메일을 더 정중하고 설득력 있게 다듬습니다.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <FeedbackProvider>{children}</FeedbackProvider>
      </body>
    </html>
  );
}
