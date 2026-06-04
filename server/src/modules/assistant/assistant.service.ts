import { pool } from '../../db/pool.js'
import { env } from '../../config/env.js'

type AskAssistantParams = {
	userId?: number | null
	question: string
}

type ProductRow = {
	id: number
	title: string
	brand: string
	category: string
	price: number
	rating: string | number
	stock: number
	description: string
}

const fallbackAnswers: Record<string, string> = {
	'Не получается оформить заказ':
		'Проверьте, что вы вошли в аккаунт, добавили товары в корзину и указали адрес доставки. После этого нажмите кнопку подтверждения заказа.',
	'Как добавить email к профилю?':
		'Откройте профиль через аватар в шапке сайта, введите email в поле для электронных чеков и нажмите кнопку сохранения.',
	'Как изменить аватар?':
		'Откройте профиль, выберите изображение в формате JPG, PNG или WEBP размером до 2 МБ и сохраните изменения.',
	'Как удалить товар из корзины?':
		'Откройте корзину и нажмите на кнопку удаления рядом с товаром или уменьшайте количество товара до удаления позиции.',
	'Как выбрать смартфон?':
		'Используйте фильтр по бренду, сортировку по цене или рейтингу и откройте карточку товара, чтобы посмотреть характеристики.',
	'Как посмотреть историю заказов?':
		'Откройте профиль через аватар в шапке сайта. История заказов отображается в нижней части окна профиля.',
	'Как добавить товар в избранное?':
		'Нажмите на иконку сердца в карточке товара. После этого товар появится в разделе избранного.',
	'Почему нужно войти в аккаунт?':
		'Вход нужен для сохранения корзины, избранного, профиля и истории заказов в базе данных.',
}

function getRuleBasedAnswer(question: string) {
	const normalizedQuestion = question.trim().toLowerCase()

	const directAnswer = fallbackAnswers[question]

	if (directAnswer) {
		return directAnswer
	}

	if (
		normalizedQuestion.includes('заказ') ||
		normalizedQuestion.includes('оформ')
	) {
		return fallbackAnswers['Не получается оформить заказ']
	}

	if (
		normalizedQuestion.includes('email') ||
		normalizedQuestion.includes('почт')
	) {
		return fallbackAnswers['Как добавить email к профилю?']
	}

	if (
		normalizedQuestion.includes('аватар') ||
		normalizedQuestion.includes('фото')
	) {
		return fallbackAnswers['Как изменить аватар?']
	}

	if (
		normalizedQuestion.includes('корзин') ||
		normalizedQuestion.includes('удал')
	) {
		return fallbackAnswers['Как удалить товар из корзины?']
	}

	if (
		normalizedQuestion.includes('смартфон') ||
		normalizedQuestion.includes('телефон') ||
		normalizedQuestion.includes('выбрать')
	) {
		return fallbackAnswers['Как выбрать смартфон?']
	}

	if (
		normalizedQuestion.includes('истор') ||
		normalizedQuestion.includes('профил')
	) {
		return fallbackAnswers['Как посмотреть историю заказов?']
	}

	if (
		normalizedQuestion.includes('избран') ||
		normalizedQuestion.includes('серд')
	) {
		return fallbackAnswers['Как добавить товар в избранное?']
	}

	return 'Я могу помочь с товарами, корзиной, избранным, профилем, доставкой и оформлением заказа. Уточните, пожалуйста, вопрос по работе интернет-магазина.'
}

async function getProductsContext() {
	const result = await pool.query<ProductRow>(`
		SELECT id, title, brand, category, price, rating, stock, description
		FROM products
		ORDER BY id
		LIMIT 12
	`)

	return result.rows
		.map(product => {
			return `- ${product.title}; бренд: ${product.brand}; категория: ${product.category}; цена: ${product.price} ₽; рейтинг: ${product.rating}; в наличии: ${product.stock}; описание: ${product.description}`
		})
		.join('\n')
}

async function askOpenRouter(question: string) {
	if (!env.OPENROUTER_API_KEY) {
		return null
	}

	const productsContext = await getProductsContext()

	const systemPrompt = `
Ты ИИ-ассистент e-commerce платформы NovaStore.

Твоя задача:
- помогать пользователю по вопросам интернет-магазина;
- объяснять работу каталога, корзины, избранного, профиля, доставки и оформления заказа;
- помогать выбрать смартфон на основе каталога;
- отвечать кратко, понятно и по делу на русском языке.

Ограничения:
- отвечай только в контексте NovaStore и e-commerce платформы;
- не проси пароль, банковские данные и секретные коды;
- не выдумывай точные цены, наличие и характеристики, если их нет в данных каталога;
- если вопрос не относится к магазину, вежливо скажи, что можешь помочь только по работе платформы;
- если пользователь спрашивает про оплату, поясни, что сейчас доступен демонстрационный сценарий оформления заказа.

Данные каталога:
${productsContext}
`.trim()

	const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
			'Content-Type': 'application/json',
			'HTTP-Referer': env.OPENROUTER_SITE_URL,
			'X-Title': env.OPENROUTER_SITE_NAME,
		},
		body: JSON.stringify({
			model: env.OPENROUTER_MODEL,
			messages: [
				{
					role: 'system',
					content: systemPrompt,
				},
				{
					role: 'user',
					content: question,
				},
			],
			temperature: 0.4,
			max_tokens: 500,
		}),
	})

	if (!response.ok) {
		return null
	}

	const data = (await response.json()) as {
		choices?: Array<{
			message?: {
				content?: string
			}
		}>
	}

	return data.choices?.[0]?.message?.content?.trim() || null
}

async function saveAssistantMessage(
	userId: number | null | undefined,
	question: string,
	answer: string,
) {
	await pool.query(
		`
		INSERT INTO assistant_messages (user_id, question, answer)
		VALUES ($1, $2, $3)
		`,
		[userId ?? null, question, answer],
	)
}

export async function askAssistant({ userId, question }: AskAssistantParams) {
	const trimmedQuestion = question.trim()

	if (!trimmedQuestion) {
		throw new Error('Введите вопрос для ассистента')
	}

	if (trimmedQuestion.length > 700) {
		throw new Error('Вопрос слишком длинный. Сократите сообщение до 700 символов.')
	}

	let answer: string | null = null

	try {
		answer = await askOpenRouter(trimmedQuestion)
	} catch {
		answer = null
	}

	if (!answer) {
		answer = getRuleBasedAnswer(trimmedQuestion)
	}

	await saveAssistantMessage(userId, trimmedQuestion, answer)

	return {
		answer,
	}
}

export async function getAssistantHistory(userId: number) {
	const result = await pool.query(
		`
		SELECT id, question, answer, created_at
		FROM assistant_messages
		WHERE user_id = $1
		ORDER BY created_at DESC
		LIMIT 30
		`,
		[userId],
	)

	return result.rows.map(row => ({
		id: row.id,
		question: row.question,
		answer: row.answer,
		createdAt: row.created_at,
	}))
}