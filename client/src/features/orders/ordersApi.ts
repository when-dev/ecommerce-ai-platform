import { apiRequest } from '../../api/apiClient'
import type { Order } from './orderStore'

export function createOrderRequest(data: {
	deliveryAddress: string
	paymentMethod: string
}) {
	return apiRequest<Order>('/orders', {
		method: 'POST',
		body: JSON.stringify(data),
	})
}

export function getMyOrdersRequest() {
	return apiRequest<Order[]>('/orders/my')
}

export function payOrderRequest(orderId: number) {
	return apiRequest<{
		id: number
		status: string
		paymentMethod: string
		paymentStatus: string
		paidAt: string | null
	}>(`/orders/${orderId}/pay`, {
		method: 'POST',
	})
}
