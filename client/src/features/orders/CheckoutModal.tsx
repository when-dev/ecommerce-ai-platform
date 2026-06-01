import { X } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../auth/authStore'
import { useCartStore } from '../cart/cartStore'
import { useCheckoutModalStore } from './checkoutModalStore'
import { useOrderStore } from './orderStore'
import { usePaymentModalStore } from '../payment/paymentModalStore.ts'

export function CheckoutModal() {
	const isOpen = useCheckoutModalStore(state => state.isOpen)
	const close = useCheckoutModalStore(state => state.close)

	const user = useAuthStore(state => state.user)
	const items = useCartStore(state => state.items)
	const setCartItems = useCartStore(state => state.setCartItems)
	const closeCart = useCartStore(state => state.closeCart)

	const createOrder = useOrderStore(state => state.createOrder)
	const isOrderLoading = useOrderStore(state => state.isLoading)

	const openPaymentModal = usePaymentModalStore(state => state.open)

	const [deliveryAddress, setDeliveryAddress] = useState('')
	const [paymentMethod, setPaymentMethod] = useState('Оплата при получении')
	const [error, setError] = useState('')
	const [successOrderId, setSuccessOrderId] = useState<number | null>(null)

	const totalPrice = items.reduce(
		(sum, item) => sum + item.product.price * item.quantity,
		0,
	)

	if (!isOpen || !user) {
		return null
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setError('')

		if (items.length === 0) {
			setError('Корзина пуста')
			return
		}

		if (deliveryAddress.trim().length < 8) {
			setError('Введите корректный адрес доставки')
			return
		}

		if (!user) {
			setError('Для оформления заказа необходимо войти в аккаунт')
			return
		}

		try {
			const order = await createOrder({
				deliveryAddress,
				paymentMethod,
			})

			setSuccessOrderId(order.id)
			setCartItems([])
			closeCart()

			if (paymentMethod === 'Картой онлайн') {
				close()
				openPaymentModal(order.id)
			}
		} catch (error) {
			setError(
				error instanceof Error ? error.message : 'Не удалось оформить заказ',
			)
		}
	}

	function handleClose() {
		setDeliveryAddress('')
		setPaymentMethod('Оплата при получении')
		setError('')
		setSuccessOrderId(null)
		close()
	}

	return (
		<div
			onClick={handleClose}
			className='fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4'
		>
			<div
				onClick={event => event.stopPropagation()}
				className='w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl'
			>
				<div className='mb-6 flex items-center justify-between'>
					<div>
						<h2 className='text-2xl font-bold text-slate-900'>
							Оформление заказа
						</h2>
						<p className='mt-1 text-sm text-slate-500'>
							Проверьте данные доставки и способ оплаты
						</p>
					</div>

					<button
						onClick={handleClose}
						className='rounded-xl p-2 text-slate-500 hover:bg-slate-100'
					>
						<X size={22} />
					</button>
				</div>

				{successOrderId ? (
					<div>
						<div className='mb-5 rounded-2xl bg-emerald-50 px-4 py-4 text-emerald-700'>
							Заказ №{successOrderId} успешно оформлен. Историю заказов можно
							посмотреть в профиле.
						</div>

						<button
							onClick={handleClose}
							className='w-full rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-800'
						>
							Закрыть
						</button>
					</div>
				) : (
					<form onSubmit={handleSubmit} className='space-y-4'>
						<div className='rounded-2xl bg-slate-50 p-4'>
							<div className='mb-2 text-sm font-medium text-slate-700'>
								Товары в заказе
							</div>

							<div className='space-y-2'>
								{items.map(item => (
									<div
										key={item.product.id}
										className='flex justify-between gap-3 text-sm'
									>
										<span className='text-slate-600'>
											{item.product.title} × {item.quantity}
										</span>
										<span className='font-medium text-slate-900'>
											{(item.product.price * item.quantity).toLocaleString(
												'ru-RU',
											)}{' '}
											₽
										</span>
									</div>
								))}
							</div>

							<div className='mt-4 flex justify-between border-t border-slate-200 pt-3 font-bold'>
								<span>Итого</span>
								<span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
							</div>
						</div>

						<label className='block'>
							<span className='mb-1 block text-sm font-medium text-slate-700'>
								Адрес доставки
							</span>
							<input
								value={deliveryAddress}
								onChange={event => setDeliveryAddress(event.target.value)}
								placeholder='Город, улица, дом, квартира'
								className='w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400'
							/>
						</label>

						<label className='block'>
							<span className='mb-1 block text-sm font-medium text-slate-700'>
								Способ оплаты
							</span>
							<select
								value={paymentMethod}
								onChange={event => setPaymentMethod(event.target.value)}
								className='w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400'
							>
								<option>Оплата при получении</option>
								<option>Картой онлайн</option>
							</select>
						</label>

						{error && (
							<div className='rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600'>
								{error}
							</div>
						)}

						<button
							type='submit'
							disabled={isOrderLoading}
							className='w-full rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300'
						>
							{isOrderLoading ? 'Оформление...' : 'Подтвердить заказ'}
						</button>
					</form>
				)}
			</div>
		</div>
	)
}
