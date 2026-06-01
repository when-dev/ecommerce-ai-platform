import type { Request, Response } from 'express'
import { askAssistant, getAssistantHistory } from './assistant.service.js'

type AuthRequest = Request & {
	user?: {
		id: number
		role: string
	}
}

export async function askAssistantController(req: AuthRequest, res: Response) {
	try {
		const { question } = req.body as { question?: string }

		if (!question || typeof question !== 'string') {
			res.status(400).json({ message: 'Вопрос обязателен' })
			return
		}

		const result = await askAssistant({
			userId: req.user?.id ?? null,
			question,
		})

		res.json(result)
	} catch (error) {
		res.status(400).json({
			message:
				error instanceof Error
					? error.message
					: 'Не удалось получить ответ ассистента',
		})
	}
}

export async function getAssistantHistoryController(
	req: AuthRequest,
	res: Response,
) {
	try {
		if (!req.user) {
			res.status(401).json({ message: 'Необходима авторизация' })
			return
		}

		const history = await getAssistantHistory(req.user.id)

		res.json(history)
	} catch (error) {
		res.status(400).json({
			message:
				error instanceof Error
					? error.message
					: 'Не удалось получить историю ассистента',
		})
	}
}