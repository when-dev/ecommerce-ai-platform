import { Heart, Minus, Plus, ShoppingCart, X } from 'lucide-react'
import { useAuthModalStore } from '../auth/authModalStore'
import { useAuthStore } from '../auth/authStore'
import { useCartStore } from '../cart/cartStore'
import { useFavoritesStore } from '../favorites/favoritesStore'
import { useProductDetailsStore } from './productDetailsStore'

export function ProductDetailsModal() {
	const product = useProductDetailsStore(state => state.selectedProduct)
	const closeProductDetails = useProductDetailsStore(
		state => state.closeProductDetails,
	)

	const user = useAuthStore(state => state.user)
	const openAuthModal = useAuthModalStore(state => state.open)

	const addItem = useCartStore(state => state.addItem)
	const increaseItem = useCartStore(state => state.increaseItem)
	const decreaseItem = useCartStore(state => state.decreaseItem)
	const cartItem = useCartStore(state =>
		product ? state.items.find(item => item.product.id === product.id) : null,
	)

	const toggleFavorite = useFavoritesStore(state => state.toggleFavorite)
	const isFavorite = useFavoritesStore(state =>
		product ? state.isFavorite(product.id) : false,
	)

	if (!product) {
		return null
	}

	const currentProduct = product

	async function handleAddToCart() {
		if (!user) {
			closeProductDetails()
			openAuthModal()
			return
		}

		await addItem(currentProduct)
	}

	async function handleToggleFavorite() {
		if (!user) {
			closeProductDetails()
			openAuthModal()
			return
		}

		await toggleFavorite(currentProduct)
	}

	return (
		<div
			onClick={closeProductDetails}
			className='fixed inset-0 z-60 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm'
		>
			<div
				onClick={event => event.stopPropagation()}
				className='max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl'
			>
				<div className='flex items-center justify-between border-b border-slate-200 px-6 py-5'>
					<div>
						<h2 className='text-2xl font-bold tracking-tight text-slate-950'>
							{product.title}
						</h2>
						<p className='mt-1 text-sm text-slate-500'>
							Подробная информация о товаре
						</p>
					</div>

					<button
						onClick={closeProductDetails}
						className='rounded-xl p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-700'
					>
						<X size={22} />
					</button>
				</div>

				<div className='grid gap-6 p-6 md:grid-cols-[1fr_1.1fr]'>
					<div className='flex min-h-105 items-center justify-center rounded-3xl bg-linear-to-br from-slate-50 to-blue-50 px-8 py-8'>
						<img
							src={product.imageUrl}
							alt={product.title}
							className='max-h-90 max-w-full object-contain'
						/>
					</div>

					<div>
						<div className='mb-4 flex flex-wrap items-center gap-2'>
							<span className='rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700'>
								{product.brand}
							</span>

							<span className='rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600'>
								{product.category}
							</span>

							<span className='rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600'>
								★ {product.rating}
							</span>

							<span className='rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700'>
								В наличии: {product.stock}
							</span>
						</div>

						<p className='mb-5 text-base leading-7 text-slate-600'>
							{product.description}
						</p>

						<div className='mb-5 text-4xl font-bold tracking-tight text-slate-950'>
							{product.price.toLocaleString('ru-RU')} ₽
						</div>

						<div className='mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'>
							<h3 className='mb-3 font-semibold text-slate-950'>
								Характеристики
							</h3>

							<div>
								{Object.entries(product.specs ?? {}).map(([name, value]) => (
									<div
										key={name}
										className='flex items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0'
									>
										<span className='text-sm text-slate-500'>{name}</span>
										<span className='text-right text-sm font-semibold text-slate-950'>
											{String(value)}
										</span>
									</div>
								))}
							</div>
						</div>

						<div className='flex flex-col gap-3 sm:flex-row'>
							{cartItem ? (
								<div className='flex h-12 flex-1 items-center justify-between rounded-2xl bg-blue-600 px-3 text-white shadow-sm'>
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
									className='flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700'
								>
									<ShoppingCart size={18} />
									Добавить в корзину
								</button>
							)}

							<button
								onClick={handleToggleFavorite}
								className={`flex h-12 items-center justify-center gap-2 rounded-2xl border px-5 text-sm font-semibold transition ${
									isFavorite
										? 'border-blue-600 bg-blue-600 text-white shadow-sm'
										: 'border-slate-200 text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
								}`}
							>
								<Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
								{isFavorite ? 'В избранном' : 'В избранное'}
							</button>
						</div>

						{!user && (
							<div className='mt-4 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-700'>
								Для добавления товара в корзину или избранное необходимо войти в
								аккаунт.
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}