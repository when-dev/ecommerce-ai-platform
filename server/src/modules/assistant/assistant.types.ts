export type AssistantMessage = {
  id: number;
  userId: number | null;
  question: string;
  answer: string;
  createdAt: string;
};

export type AssistantAnswer = {
  answer: string;
};