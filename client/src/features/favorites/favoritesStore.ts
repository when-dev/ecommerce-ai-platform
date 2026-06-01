import { create } from 'zustand'
import type { Product } from '../../types/product'
import {
	addFavoriteRequest,
	getFavoritesRequest,
	removeFavoriteRequest,
} from './favoritesApi'

type FavoritesStore = {
	isOpen: boolean
	items: Product[]
	isLoading: boolean
	error: string

	openFavorites: () => void
	closeFavorites: () => void

	fetchFavorites: () => Promise<void>
	toggleFavorite: (product: Product) => Promise<void>
	isFavorite: (productId: number) => boolean
	removeFavorite: (productId: number) => Promise<void>

	resetFavorites: () => void
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
	isOpen: false,
	items: [],
	isLoading: false,
	error: '',

	openFavorites: () => set({ isOpen: true }),
	closeFavorites: () => set({ isOpen: false }),

	fetchFavorites: async () => {
		set({ isLoading: true, error: '' })

		try {
			const items = await getFavoritesRequest()
			set({ items })
		} catch {
			set({ items: [] })
		} finally {
			set({ isLoading: false })
		}
	},

	toggleFavorite: async product => {
		const exists = get().items.some(item => item.id === product.id)

		try {
			if (exists) {
				const items = await removeFavoriteRequest(product.id)
				set({ items })
				return
			}

			const items = await addFavoriteRequest(product.id)
			set({ items })
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'Не удалось изменить избранное'
			set({ error: message })
			throw new Error(message, { cause: error })
		}
	},

	isFavorite: productId => {
		return get().items.some(item => item.id === productId)
	},

	removeFavorite: async productId => {
		const items = await removeFavoriteRequest(productId)
		set({ items })
	},
	resetFavorites: () =>
		set({
			isOpen: false,
			items: [],
			isLoading: false,
			error: '',
		}),
}))
