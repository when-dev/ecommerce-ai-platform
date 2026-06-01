import type { AssistantMessage } from "./assistant.types.js";

type AssistantMessageRow = {
  id: number;
  user_id: number | null;
  question: string;
  answer: string;
  created_at: Date;
};

export function mapAssistantMessageRow(
  row: AssistantMessageRow
): AssistantMessage {
  return {
    id: row.id,
    userId: row.user_id,
    question: row.question,
    answer: row.answer,
    createdAt: row.created_at.toISOString(),
  };
}