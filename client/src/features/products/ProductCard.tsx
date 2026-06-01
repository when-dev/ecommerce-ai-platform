import { Heart, Minus, Plus, ShoppingCart } from 'lucide-react'
import type { Product } from '../../types/product'
import { useCartStore } from '../cart/cartStore'
import { useFavoritesStore } from '../favorites/favoritesStore'
import { useProductDetailsStore } from './productDetailsStore'
import { useAuthStore } from '../auth/authStore'
import { useAuthModalStore } from '../auth/authModalStore'

type ProductCardProps = {
	product: Product
}

export function ProductCard({ product }: ProductCardProps) {
	const addItem = useCartStore(state => state.addItem)
	const increaseItem = useCartStore(state => state.increaseItem)
	const decreaseItem = useCartStore(state => state.decreaseItem)

	const user = useAuthStore(state => state.user)
	const openAuthModal = useAuthModalStore(state => state.open)

	const cartItem = useCartStore(state =>
		state.items.find(item => item.product.id === product.id),
	)

	const openProductDetails = useProductDetailsStore(
		state => state.openProductDetails,
	)

	const toggleFavorite = useFavoritesStore(state => state.toggleFavorite)
	const isFavorite = useFavoritesStore(state => state.isFavorite(product.id))

	async function handleAddToCart() {
		if (!user) {
			openAuthModal()
			return
		}

		await addItem(product)
	}

	async function handleToggleFavorite() {
		if (!user) {
			openAuthModal()
			return
		}

		await toggleFavorite(product)
	}

	return (
		<article className='relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:border-blue-200 hover:shadow-lg'>
			<button
				onClick={handleToggleFavorite}
				className={`absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition ${
					isFavorite
						? 'bg-blue-600 text-white'
						: 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700'
				}`}
			>
				<Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
			</button>

			<button
				onClick={() => openProductDetails(product)}
				className='block w-full text-left'
			>
				<div className='flex h-56 w-full items-center justify-center bg-linear-to-br from-slate-50 to-blue-50 px-6 py-5'>
					<img
						src={product.imageUrl}
						alt={product.title}
						className='max-h-full max-w-full object-contain transition duration-300 hover:scale-105'
					/>
				</div>
			</button>

			<div className='flex flex-1 flex-col p-5'>
				<div className='mb-3 flex items-center justify-between gap-2'>
					<span className='rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700'>
						{product.brand}
					</span>

					<span className='rounded-full bg-orange-50 px-2.5 py-1 text-sm font-medium text-orange-600'>
						★ {product.rating}
					</span>
				</div>

				<button
					onClick={() => openProductDetails(product)}
					className='mb-2 block text-left'
				>
					<h3 className='text-lg font-semibold text-slate-950 transition hover:text-blue-700'>
						{product.title}
					</h3>
				</button>

				<button
					onClick={() => openProductDetails(product)}
					className='mb-4 block min-h-10 text-left'
				>
					<p className='line-clamp-2 text-sm leading-6 text-slate-600'>
						{product.description}
					</p>
				</button>

				<div className='mt-auto mb-4 text-2xl font-bold tracking-tight text-slate-950'>
					{product.price.toLocaleString('ru-RU')} ₽
				</div>

				{cartItem ? (
					<div className='flex h-12 items-center justify-between rounded-2xl bg-blue-600 px-3 text-white'>
						<button
							onClick={() => decreaseItem(product.id)}
							className='flex h-9 w-9 items-center justify-center rounded-xl transition hover:bg-white/10'
						>
							<Minus size={18} />
						</button>

						<span className='font-semibold'>{cartItem.quantity}</span>

						<button
							onClick={() => increaseItem(product.id)}
							className='flex h-9 w-9 items-center justify-center rounded-xl transition hover:bg-white/10'
						>
							<Plus size={18} />
						</button>
					</div>
				) : (
					<button
						onClick={handleAddToCart}
						className='flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700'
					>
						<ShoppingCart size={18} />В корзину
					</button>
				)}
			</div>
		</article>
	)
}
