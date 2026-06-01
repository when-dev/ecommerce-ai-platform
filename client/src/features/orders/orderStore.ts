import { create } from 'zustand'
import type { Product } from '../../types/product'
import { createOrderRequest, getMyOrdersRequest } from './ordersApi'

export type OrderStatus = 'Создан' | 'В обработке' | 'Доставляется' | 'Завершен'

export type OrderItem = {
	id: number
	product: Product
	quantity: number
	price: number
}

export type Order = {
	id: number
	userId: number
	items: OrderItem[]
	totalPrice: number
	deliveryAddress: string
	paymentMethod: string
	status: OrderStatus
	createdAt: string
	paymentStatus: string
	paidAt: string | null
	paymentExpiresAt: string | null
}

type OrderStore = {
	orders: Order[]
	isLoading: boolean
	error: string

	fetchOrders: () => Promise<void>
	createOrder: (data: {
		deliveryAddress: string
		paymentMethod: string
	}) => Promise<Order>

	resetOrders: () => void
}

export const useOrderStore = create<OrderStore>(set => ({
	orders: [],
	isLoading: false,
	error: '',

	fetchOrders: async () => {
		set({ isLoading: true, error: '' })

		try {
			const orders = await getMyOrdersRequest()
			set({ orders })
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'Не удалось загрузить заказы',
			})
		} finally {
			set({ isLoading: false })
		}
	},

	createOrder: async data => {
		set({ isLoading: true, error: '' })

		try {
			const order = await createOrderRequest(data)

			set(state => ({
				orders: [order, ...state.orders],
			}))

			return order
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'Не удалось оформить заказ'

			set({ error: message })
			throw new Error(message, { cause: error })
		} finally {
			set({ isLoading: false })
		}
	},
	resetOrders: () =>
		set({
			orders: [],
			isLoading: false,
			error: '',
		}),
}))
