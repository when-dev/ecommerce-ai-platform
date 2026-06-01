import { create } from 'zustand'
import type { Product } from '../../types/product'
import {
	addCartItemRequest,
	clearCartRequest,
	getCartRequest,
	removeCartItemRequest,
	updateCartItemRequest,
} from './cartApi'

export type CartItem = {
	id?: number
	product: Product
	quantity: number
}

type CartStore = {
	isOpen: boolean
	items: CartItem[]
	isLoading: boolean
	error: string

	openCart: () => void
	closeCart: () => void

	fetchCart: () => Promise<void>
	addItem: (product: Product) => Promise<void>
	removeItem: (productId: number) => Promise<void>
	increaseItem: (productId: number) => Promise<void>
	decreaseItem: (productId: number) => Promise<void>
	clearCart: () => Promise<void>
	setCartItems: (items: CartItem[]) => void
	resetCart: () => void
}

export const useCartStore = create<CartStore>((set, get) => ({
	isOpen: false,
	items: [],
	isLoading: false,
	error: '',

	openCart: () => set({ isOpen: true }),
	closeCart: () => set({ isOpen: false }),

	fetchCart: async () => {
		set({ isLoading: true, error: '' })

		try {
			const items = await getCartRequest()
			set({ items })
		} catch {
			set({ items: [] })
		} finally {
			set({ isLoading: false })
		}
	},

	addItem: async product => {
		set({ error: '' })

		try {
			const items = await addCartItemRequest(product.id)
			set({ items })
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'Не удалось добавить товар'

			set({ error: message })
			throw new Error(message, { cause: error })
		}
	},

	removeItem: async productId => {
		const items = await removeCartItemRequest(productId)
		set({ items })
	},

	increaseItem: async productId => {
		const currentItem = get().items.find(item => item.product.id === productId)

		if (!currentItem) {
			return
		}

		const items = await updateCartItemRequest(
			productId,
			currentItem.quantity + 1,
		)

		set({ items })
	},

	decreaseItem: async productId => {
		const currentItem = get().items.find(item => item.product.id === productId)

		if (!currentItem) {
			return
		}

		const items = await updateCartItemRequest(
			productId,
			currentItem.quantity - 1,
		)

		set({ items })
	},

	clearCart: async () => {
		await clearCartRequest()
		set({ items: [] })
	},

	setCartItems: items => set({ items }),

	resetCart: () =>
		set({
			isOpen: false,
			items: [],
			isLoading: false,
			error: '',
		}),
}))