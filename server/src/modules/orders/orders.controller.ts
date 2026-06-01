import type { Response } from 'express'
import type { AuthRequest } from '../../middleware/authMiddleware.js'
import { createOrder, getUserOrders, payOrder } from './orders.service.js'

export async function createOrderController(req: AuthRequest, res: Response) {
	if (!req.user) {
		res.status(401).json({ message: 'Требуется авторизация' })
		return
	}

	const deliveryAddress = String(req.body.deliveryAddress ?? '').trim()
	const paymentMethod = String(req.body.paymentMethod ?? '').trim()

	if (deliveryAddress.length < 8) {
		res.status(400).json({ message: 'Введите корректный адрес доставки' })
		return
	}

	if (!paymentMethod) {
		res.status(400).json({ message: 'Выберите способ оплаты' })
		return
	}

	try {
		const order = await createOrder(req.user.userId, {
			deliveryAddress,
			paymentMethod,
		})

		res.status(201).json(order)
	} catch (error) {
		res.status(400).json({
			message:
				error instanceof Error ? error.message : 'Ошибка оформления заказа',
		})
	}
}

export async function getMyOrdersController(req: AuthRequest, res: Response) {
	if (!req.user) {
		res.status(401).json({ message: 'Требуется авторизация' })
		return
	}

	const orders = await getUserOrders(req.user.userId)

	res.json(orders)
}

export async function payOrderController(req: AuthRequest, res: Response) {
	try {
		if (!req.user) {
			res.status(401).json({ message: 'Необходима авторизация' })
			return
		}

		const orderId = Number(req.params.id)

		if (!Number.isInteger(orderId)) {
			res.status(400).json({ message: 'Некорректный id заказа' })
			return
		}

		const userId = req.user.userId

		const result = await payOrder(userId, orderId)

		res.json(result)
	} catch (error) {
		res.status(400).json({
			message:
				error instanceof Error ? error.message : 'Не удалось оплатить заказ',
		})
	}
}