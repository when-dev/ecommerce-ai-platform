import { Minus, Plus, ShoppingCart, X } from 'lucide-react'
import { useAuthModalStore } from '../auth/authModalStore'
import { useAuthStore } from '../auth/authStore'
import { useCheckoutModalStore } from '../orders/checkoutModalStore'
import { useCartStore } from './cartStore'

export function CartDrawer() {
	const {
		isOpen,
		items,
		closeCart,
		removeItem,
		increaseItem,
		decreaseItem,
	} = useCartStore()

	const user = useAuthStore(state => state.user)
	const openAuthModal = useAuthModalStore(state => state.open)
	const openCheckoutModal = useCheckoutModalStore(state => state.open)

	const totalPrice = items.reduce(
		(sum, item) => sum + item.product.price * item.quantity,
		0,
	)

	if (!isOpen) {
		return null
	}

	function handleCheckout() {
		if (!user) {
			closeCart()
			openAuthModal()
			return
		}

		closeCart()
		openCheckoutModal()
	}

	return (
		<div onClick={closeCart} className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm'>
			<aside
				onClick={event => event.stopPropagation()}
				className='ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-2xl'
			>
				<div className='flex items-center justify-between border-b border-slate-200 px-5 py-4'>
					<div className='flex items-center gap-3'>
						<div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700'>
							<ShoppingCart size={22} />
						</div>

						<div>
							<h2 className='text-xl font-bold text-slate-950'>Корзина</h2>
							<p className='mt-0.5 text-sm text-slate-500'>
								{items.length > 0
									? `${items.length} товар(ов) в заказе`
									: 'Добавьте товары для оформления'}
							</p>
						</div>
					</div>

					<button
						onClick={closeCart}
						className='rounded-xl p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-700'
					>
						<X size={22} />
					</button>
				</div>

				<div className='flex-1 overflow-y-auto p-5'>
					{items.length === 0 ? (
						<div className='flex h-full min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-blue-200 bg-blue-50/50 p-6 text-center'>
							<div className='mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm'>
								<ShoppingCart size={26} />
							</div>

							<h3 className='font-bold text-slate-950'>Корзина пуста</h3>
							<p className='mt-2 text-sm leading-6 text-slate-500'>
								Добавьте смартфон из каталога, чтобы перейти к оформлению
								заказа.
							</p>
						</div>
					) : (
						<div className='space-y-4'>
							{items.map(item => (
								<div
									key={item.product.id}
									className='rounded-3xl border border-slate-200 bg-white p-4 shadow-sm'
								>
									<div className='mb-4 flex gap-3'>
										<div className='flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-slate-50 to-blue-50 p-2'>
											<img
												src={item.product.imageUrl}
												alt={item.product.title}
												className='h-full w-full object-contain'
											/>
										</div>

										<div className='min-w-0 flex-1'>
											<h3 className='line-clamp-2 font-semibold text-slate-950'>
												{item.product.title}
											</h3>

											<p className='mt-1 text-sm text-slate-500'>
												{item.product.brand}
											</p>

											<p className='mt-2 font-bold text-slate-950'>
												{item.product.price.toLocaleString('ru-RU')} ₽
											</p>
										</div>

										<button
											onClick={() => void removeItem(item.product.id)}
											className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-600'
										>
											<X size={18} />
										</button>
									</div>

									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1'>
											<button
												onClick={() => void decreaseItem(item.product.id)}
												className='flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm transition hover:bg-blue-50 hover:text-blue-700'
											>
												<Minus size={16} />
											</button>

											<span className='w-8 text-center font-semibold text-slate-950'>
												{item.quantity}
											</span>

											<button
												onClick={() => void increaseItem(item.product.id)}
												className='flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm transition hover:bg-blue-50 hover:text-blue-700'
											>
												<Plus size={16} />
											</button>
										</div>

										<div className='text-right'>
											<p className='text-xs text-slate-500'>Сумма</p>
											<p className='font-bold text-slate-950'>
												{(
													item.product.price * item.quantity
												).toLocaleString('ru-RU')}{' '}
												₽
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				<div className='border-t border-slate-200 bg-white p-5'>
					{!user && items.length > 0 && (
						<div className='mb-4 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-700'>
							Для оформления заказа необходимо войти или зарегистрироваться.
						</div>
					)}

					<div className='mb-4 rounded-3xl bg-blue-50 px-4 py-4'>
						<div className='flex items-center justify-between'>
							<span className='text-sm font-medium text-blue-700'>Итого</span>
							<span className='text-2xl font-bold text-slate-950'>
								{totalPrice.toLocaleString('ru-RU')} ₽
							</span>
						</div>
					</div>

					<button
						disabled={items.length === 0}
						onClick={handleCheckout}
						className='w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300'
					>
						{user ? 'Оформить заказ' : 'Войти для оформления'}
					</button>
				</div>
			</aside>
		</div>
	)
}