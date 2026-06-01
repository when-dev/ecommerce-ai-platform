import { pool } from '../../db/pool.js'
import { mapOrderItemRow } from './orders.mapper.js'

async function restoreStockForOrder(orderId: number) {
	const itemsResult = await pool.query(
		`
		SELECT product_id, quantity
		FROM order_items
		WHERE order_id = $1
		`,
		[orderId],
	)

	for (const item of itemsResult.rows) {
		await pool.query(
			`
			UPDATE products
			SET stock = stock + $1
			WHERE id = $2
			`,
			[item.quantity, item.product_id],
		)
	}
}

async function cancelExpiredOrders(userId: number) {
	const expiredOrdersResult = await pool.query(
		`
		SELECT id
		FROM orders
		WHERE user_id = $1
			AND payment_method = 'Картой онлайн'
			AND payment_status = 'Ожидает оплаты'
			AND payment_expires_at IS NOT NULL
			AND payment_expires_at < CURRENT_TIMESTAMP
		`,
		[userId],
	)

	for (const order of expiredOrdersResult.rows) {
		await restoreStockForOrder(order.id)

		await pool.query(
			`
			UPDATE orders
			SET status = 'Отменен',
				payment_status = 'Не оплачено'
			WHERE id = $1
			`,
			[order.id],
		)
	}
}

export async function createOrder(
	userId: number,
	data: {
		deliveryAddress: string
		paymentMethod: string
	},
) {
	const client = await pool.connect()

	try {
		await client.query('BEGIN')

		const cartResult = await client.query(
			`
			SELECT
				cart_items.product_id,
				cart_items.quantity,
				products.price,
				products.stock
			FROM cart_items
			JOIN products ON products.id = cart_items.product_id
			WHERE cart_items.user_id = $1
			`,
			[userId],
		)

		if (cartResult.rows.length === 0) {
			throw new Error('Корзина пуста')
		}

		for (const item of cartResult.rows) {
			if (Number(item.quantity) > Number(item.stock)) {
				throw new Error('Недостаточное количество товара на складе')
			}
		}

		const totalPrice = cartResult.rows.reduce((sum, item) => {
			return sum + Number(item.price) * Number(item.quantity)
		}, 0)

		const orderStatus =
			data.paymentMethod === 'Картой онлайн' ? 'Ожидает оплаты' : 'Создан'

		const paymentStatus =
			data.paymentMethod === 'Картой онлайн'
				? 'Ожидает оплаты'
				: 'Оплата при получении'

		const paymentExpiresAt =
			data.paymentMethod === 'Картой онлайн'
				? new Date(Date.now() + 30 * 60 * 1000)
				: null

		const orderResult = await client.query(
			`
	INSERT INTO orders (
		user_id,
		total_price,
		delivery_address,
		payment_method,
		status,
		payment_status,
		payment_expires_at
	)
	VALUES ($1, $2, $3, $4, $5, $6, $7)
	RETURNING *
	`,
			[
				userId,
				totalPrice,
				data.deliveryAddress,
				data.paymentMethod,
				orderStatus,
				paymentStatus,
				paymentExpiresAt,
			],
		)
		const order = orderResult.rows[0]

		for (const item of cartResult.rows) {
			await client.query(
				`
				INSERT INTO order_items (
					order_id,
					product_id,
					quantity,
					price
				)
				VALUES ($1, $2, $3, $4)
				`,
				[order.id, item.product_id, item.quantity, item.price],
			)

			await client.query(
				`
				UPDATE products
				SET stock = stock - $1
				WHERE id = $2
				`,
				[item.quantity, item.product_id],
			)
		}

		await client.query(
			`
			DELETE FROM cart_items
			WHERE user_id = $1
			`,
			[userId],
		)

		await client.query('COMMIT')

		return {
			id: order.id,
			userId: order.user_id,
			totalPrice: Number(order.total_price),
			status: order.status,
			deliveryAddress: order.delivery_address,
			paymentMethod: order.payment_method,
			paymentStatus: order.payment_status,
			paidAt: order.paid_at,
			paymentExpiresAt: order.payment_expires_at,
			createdAt: order.created_at.toISOString(),
			items: [],
		}
	} catch (error) {
		await client.query('ROLLBACK')
		throw error
	} finally {
		client.release()
	}
}

export async function getUserOrders(userId: number) {
	await cancelExpiredOrders(userId)

	const ordersResult = await pool.query(
		`
		SELECT *
		FROM orders
		WHERE user_id = $1
		ORDER BY created_at DESC
		`,
		[userId],
	)

	const orders = []

	for (const order of ordersResult.rows) {
		const itemsResult = await pool.query(
			`
			SELECT
				order_items.id AS order_item_id,
				order_items.quantity,
				order_items.price,

				products.id AS product_id,
				products.title,
				products.brand,
				products.category,
				products.price AS product_price,
				products.image_url,
				products.description,
				products.rating,
				products.stock,
				products.specs,
				products.created_at AS product_created_at
			FROM order_items
			JOIN products ON products.id = order_items.product_id
			WHERE order_items.order_id = $1
			`,
			[order.id],
		)

		orders.push({
			id: order.id,
			userId: order.user_id,
			totalPrice: Number(order.total_price),
			status: order.status,
			deliveryAddress: order.delivery_address,
			paymentMethod: order.payment_method,
			paymentStatus: order.payment_status,
			paidAt: order.paid_at,
			paymentExpiresAt: order.payment_expires_at,
			createdAt: order.created_at.toISOString(),
			items: itemsResult.rows.map(mapOrderItemRow),
		})
	}

	return orders
}

export async function payOrder(userId: number, orderId: number) {
	const orderResult = await pool.query(
		`
		SELECT
			id,
			user_id,
			payment_method,
			payment_status,
			payment_expires_at
		FROM orders
		WHERE id = $1 AND user_id = $2
		`,
		[orderId, userId],
	)

	const order = orderResult.rows[0]

	if (!order) {
		throw new Error('Заказ не найден')
	}

	if (order.payment_method !== 'Картой онлайн') {
		throw new Error('Для данного заказа выбран другой способ оплаты')
	}

	if (order.payment_status === 'Оплачено') {
		throw new Error('Заказ уже оплачен')
	}

	if (
		order.payment_expires_at &&
		new Date(order.payment_expires_at).getTime() < Date.now()
	) {
		await restoreStockForOrder(orderId)

		await pool.query(
			`
			UPDATE orders
			SET status = 'Отменен',
				payment_status = 'Не оплачено'
			WHERE id = $1 AND user_id = $2
			`,
			[orderId, userId],
		)

		throw new Error('Время оплаты истекло. Заказ отменен')
	}

	const result = await pool.query(
		`
		UPDATE orders
		SET payment_status = 'Оплачено',
			status = 'Оплачен',
			paid_at = CURRENT_TIMESTAMP
		WHERE id = $1 AND user_id = $2
		RETURNING
			id,
			user_id,
			total_price,
			status,
			delivery_address,
			payment_method,
			payment_status,
			paid_at,
			payment_expires_at,
			created_at
		`,
		[orderId, userId],
	)

	const paidOrder = result.rows[0]

	return {
		id: paidOrder.id,
		userId: paidOrder.user_id,
		totalPrice: Number(paidOrder.total_price),
		status: paidOrder.status,
		deliveryAddress: paidOrder.delivery_address,
		paymentMethod: paidOrder.payment_method,
		paymentStatus: paidOrder.payment_status,
		paidAt: paidOrder.paid_at,
		paymentExpiresAt: paidOrder.payment_expires_at,
		createdAt: paidOrder.created_at.toISOString(),
	}
}
