import { create } from 'zustand'

type PaymentModalStore = {
	isOpen: boolean
	orderId: number | null
	open: (orderId: number) => void
	close: () => void
}

export const usePaymentModalStore = create<PaymentModalStore>(set => ({
	isOpen: false,
	orderId: null,

	open: orderId =>
		set({
			isOpen: true,
			orderId,
		}),

	close: () =>
		set({
			isOpen: false,
			orderId: null,
		}),
}))