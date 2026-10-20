import React from "react";
import { render, screen } from "@testing-library/react";
import AssistantAnswerNotice from "./AssistantAnswerNotice";

test("shows a general knowledge warning when no relevant community chunks were found", () => {
  render(<AssistantAnswerNotice answerMode="general_knowledge_fallback" />);
  expect(screen.getByText("⚠️ No relevant community information found")).toBeInTheDocument();
  expect(screen.getByText(/general knowledge, not from discussions on this platform/i)).toBeInTheDocument();
});

test("shows a different warning when community retrieval failed", () => {
  render(<AssistantAnswerNotice answerMode="retrieval_unavailable_fallback" />);
  expect(screen.getByText("⚠️ Community search unavailable")).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent(/couldn’t retrieve community discussions/i);
});

test("shows a subtle source label for a community grounded answer", () => {
  render(<AssistantAnswerNotice answerMode="community_grounded" />);
  expect(screen.getByText("Based on community discussions")).toBeInTheDocument();
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

test("warns when community evidence is partial and the answer adds general knowledge", () => {
  render(<AssistantAnswerNotice answerMode="community_grounded" warning="Community discussions only partially answer this question. The remaining explanation uses the AI model's general knowledge and may be inaccurate." />);
  expect(screen.getByText("Based on community discussions")).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent(/only partially answer/i);
  expect(screen.getByRole("status")).toHaveTextContent(/general knowledge/i);
});
