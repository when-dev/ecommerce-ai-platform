import { Heart, ShoppingCart, X } from 'lucide-react'
import { useCartStore } from '../cart/cartStore'
import { useFavoritesStore } from './favoritesStore'

export function FavoritesDrawer() {
	const isOpen = useFavoritesStore(state => state.isOpen)
	const items = useFavoritesStore(state => state.items)
	const closeFavorites = useFavoritesStore(state => state.closeFavorites)
	const removeFavorite = useFavoritesStore(state => state.removeFavorite)

	const addItem = useCartStore(state => state.addItem)

	if (!isOpen) {
		return null
	}

	return (
		<div
			onClick={closeFavorites}
			className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm'
		>
			<aside
				onClick={event => event.stopPropagation()}
				className='ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-2xl'
			>
				<div className='flex items-center justify-between border-b border-slate-200 px-5 py-4'>
					<div className='flex items-center gap-3'>
						<div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700'>
							<Heart size={22} />
						</div>

						<div>
							<h2 className='text-xl font-bold text-slate-950'>Избранное</h2>
							<p className='mt-0.5 text-sm text-slate-500'>
								Сохраненные товары пользователя
							</p>
						</div>
					</div>

					<button
						onClick={closeFavorites}
						className='rounded-xl p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-700'
					>
						<X size={22} />
					</button>
				</div>

				<div className='flex-1 overflow-y-auto p-5'>
					{items.length === 0 ? (
						<div className='flex h-full min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-blue-200 bg-blue-50/50 p-6 text-center'>
							<div className='mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm'>
								<Heart size={26} />
							</div>

							<h3 className='font-bold text-slate-950'>
								В избранном пока пусто
							</h3>
							<p className='mt-2 text-sm leading-6 text-slate-500'>
								Нажмите на сердечко в карточке товара, чтобы сохранить его для
								просмотра позже.
							</p>
						</div>
					) : (
						<div className='space-y-4'>
							{items.map(product => (
								<div
									key={product.id}
									className='rounded-3xl border border-slate-200 bg-white p-4 shadow-sm'
								>
									<div className='mb-4 flex gap-3'>
										<div className='flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-slate-50 to-blue-50 p-2'>
											<img
												src={product.imageUrl}
												alt={product.title}
												className='h-full w-full object-contain'
											/>
										</div>

										<div className='min-w-0 flex-1'>
											<h3 className='line-clamp-2 font-semibold text-slate-950'>
												{product.title}
											</h3>

											<p className='mt-1 text-sm text-slate-500'>
												{product.brand}
											</p>

											<div className='mt-2 font-bold text-slate-950'>
												{product.price.toLocaleString('ru-RU')} ₽
											</div>
										</div>

										<button
											onClick={() => void removeFavorite(product.id)}
											className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-600'
										>
											<X size={18} />
										</button>
									</div>

									<button
										onClick={() => void addItem(product)}
										className='flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700'
									>
										<ShoppingCart size={18} />
										Добавить в корзину
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			</aside>
		</div>
	)
}