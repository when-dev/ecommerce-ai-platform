import { Bot, Send, X } from 'lucide-react'
import { useState } from 'react'
import { askAssistantRequest } from './assistantApi'
import { useAssistantStore } from './assistantStore'

type Message = {
	role: 'assistant' | 'user'
	text: string
}

const quickQuestions = [
	'Не получается оформить заказ',
	'Как добавить email к профилю?',
	'Как изменить аватар?',
	'Как удалить товар из корзины?',
	'Как выбрать смартфон?',
	'Как посмотреть историю заказов?',
	'Как добавить товар в избранное?',
	'Почему нужно войти в аккаунт?',
]

export function AssistantWidget() {
	const isOpen = useAssistantStore(state => state.isOpen)
	const closeAssistant = useAssistantStore(state => state.closeAssistant)
	const toggleAssistant = useAssistantStore(state => state.toggleAssistant)

	const [question, setQuestion] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [messages, setMessages] = useState<Message[]>([
		{
			role: 'assistant',
			text: 'Здравствуйте! Я помощник NovaStore. Можете задать вопрос о товарах, корзине, заказах, профиле или доставке.',
		},
	])

	async function sendQuestion(questionText: string) {
		const trimmedQuestion = questionText.trim()

		if (!trimmedQuestion || isLoading) {
			return
		}

		setQuestion('')
		setIsLoading(true)

		setMessages(prev => [...prev, { role: 'user', text: trimmedQuestion }])

		try {
			const response = await askAssistantRequest(trimmedQuestion)

			setMessages(prev => [
				...prev,
				{ role: 'assistant', text: response.answer },
			])
		} catch (error) {
			setMessages(prev => [
				...prev,
				{
					role: 'assistant',
					text:
						error instanceof Error
							? error.message
							: 'Не удалось получить ответ ассистента',
				},
			])
		} finally {
			setIsLoading(false)
		}
	}

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		void sendQuestion(question)
	}

	return (
		<>
			{isOpen && (
				<div className='fixed bottom-24 right-5 z-40 flex h-155 w-97.5 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl'>
					<div className='flex items-center justify-between bg-linear-to-r from-blue-600 to-blue-700 p-4 text-white'>
						<div className='flex items-center gap-3'>
							<div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15'>
								<Bot size={21} />
							</div>

							<div>
								<div className='font-semibold'>Помощник NovaStore</div>
								<div className='text-xs text-blue-100'>
									Ответы по работе платформы
								</div>
							</div>
						</div>

						<button
							onClick={closeAssistant}
							className='rounded-xl p-2 transition hover:bg-white/10'
						>
							<X size={20} />
						</button>
					</div>

					<div className='min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4'>
						{messages.map((message, index) => (
							<div
								key={index}
								className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
									message.role === 'assistant'
										? 'border border-slate-200 bg-white text-slate-700'
										: 'ml-auto bg-blue-600 text-white'
								}`}
							>
								{message.text}
							</div>
						))}

						{isLoading && (
							<div className='max-w-[85%] rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm'>
								Ассистент формирует ответ...
							</div>
						)}
					</div>

					<div className='shrink-0 border-t border-slate-200 bg-white p-3'>
						<p className='mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500'>
							Быстрые вопросы
						</p>

						<div className='mb-3 max-h-28 space-y-2 overflow-y-auto pr-1'>
							{quickQuestions.map(quickQuestion => (
								<button
									key={quickQuestion}
									disabled={isLoading}
									onClick={() => void sendQuestion(quickQuestion)}
									className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-xs text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60'
								>
									{quickQuestion}
								</button>
							))}
						</div>

						<form onSubmit={handleSubmit} className='flex gap-2'>
							<input
								value={question}
								onChange={event => setQuestion(event.target.value)}
								disabled={isLoading}
								maxLength={700}
								placeholder='Напишите вопрос...'
								className='min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-50'
							/>

							<button
								type='submit'
								disabled={isLoading || question.trim().length === 0}
								className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300'
							>
								<Send size={18} />
							</button>
						</form>
					</div>
				</div>
			)}

			<button
				onClick={toggleAssistant}
				className='fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/25 transition hover:bg-blue-700'
				aria-label='Открыть помощника'
			>
				<Bot size={24} />
			</button>
		</>
	)
}