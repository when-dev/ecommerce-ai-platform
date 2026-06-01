import { apiRequest } from "../../api/apiClient";

type AskAssistantResponse = {
	answer: string
}

export function askAssistantRequest(question: string) {
	return apiRequest<AskAssistantResponse>('/assistant/ask', {
		method: 'POST',
		body: JSON.stringify({ question }),
	})
}