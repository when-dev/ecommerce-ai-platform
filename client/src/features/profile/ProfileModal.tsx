import { LogOut, Save, UserRound, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { formatPhoneDisplay } from '../../shared/phone'
import { useAuthStore, type User } from '../auth/authStore'
import { useCartStore } from '../cart/cartStore'
import { useFavoritesStore } from '../favorites/favoritesStore'
import { useOrderStore } from '../orders/orderStore'
import { uploadAvatarRequest } from './profileApi'
import { useProfileModalStore } from './profileModalStore'

function OrderPaymentBadge({
	order,
}: {
	order: {
		status: string
		paymentMethod: string
		paymentStatus: string
		paymentExpiresAt: string | null
	}
}) {
	const [now, setNow] = useState(() => Date.now())

	useEffect(() => {
		if (order.paymentStatus !== 'Ожидает оплаты' || !order.paymentExpiresAt) {
			return
		}

		const timerId = window.setInterval(() => {
			setNow(Date.now())
		}, 1000)

		return () => window.clearInterval(timerId)
	}, [order.paymentStatus, order.paymentExpiresAt])

	if (order.paymentStatus === 'Оплачено') {
		return (
			<span className='rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700'>
				Оплата успешна
			</span>
		)
	}

	if (order.status === 'Отменен') {
		return (
			<span className='rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600'>
				Отменен
			</span>
		)
	}

	if (order.paymentMethod !== 'Картой онлайн') {
		return (
			<span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600'>
				Оплата при получении
			</span>
		)
	}

	if (order.paymentStatus === 'Ожидает оплаты' && order.paymentExpiresAt) {
		const diff = new Date(order.paymentExpiresAt).getTime() - now

		if (diff <= 0) {
			return (
				<span className='rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600'>
					Время оплаты истекло
				</span>
			)
		}

		const minutes = Math.floor(diff / 1000 / 60)
		const seconds = Math.floor((diff / 1000) % 60)

		return (
			<span className='rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700'>
				Ожидает оплаты · {minutes}:{String(seconds).padStart(2, '0')}
			</span>
		)
	}

	return (
		<span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600'>
			{order.paymentStatus}
		</span>
	)
}

export function ProfileModal() {
	const isOpen = useProfileModalStore(state => state.isOpen)
	const close = useProfileModalStore(state => state.close)
	const user = useAuthStore(state => state.user)

	if (!isOpen || !user) {
		return null
	}

	return <ProfileModalContent key={user.id} user={user} close={close} />
}

type ProfileModalContentProps = {
	user: User
	close: () => void
}

function ProfileModalContent({ user, close }: ProfileModalContentProps) {
	const updateUser = useAuthStore(state => state.updateUser)
	const isLoading = useAuthStore(state => state.isLoading)
	const logout = useAuthStore(state => state.logout)

	const resetCart = useCartStore(state => state.resetCart)
	const resetFavorites = useFavoritesStore(state => state.resetFavorites)
	const resetOrders = useOrderStore(state => state.resetOrders)

	const orders = useOrderStore(state => state.orders)
	const fetchOrders = useOrderStore(state => state.fetchOrders)
	const isOrdersLoading = useOrderStore(state => state.isLoading)

	const [email, setEmail] = useState(user.email ?? '')
	const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? '')
	const [avatarError, setAvatarError] = useState('')

	useEffect(() => {
		void fetchOrders()
	}, [fetchOrders])

	async function handleSave() {
		try {
			await updateUser({
				email,
				avatarUrl,
			})

			close()
		} catch (error) {
			setAvatarError(
				error instanceof Error ? error.message : 'Не удалось сохранить профиль',
			)
		}
	}

	function handleLogout() {
		resetCart()
		resetFavorites()
		resetOrders()
		logout()
		close()
	}

	async function handleAvatarChange(
		event: React.ChangeEvent<HTMLInputElement>,
	) {
		const file = event.target.files?.[0]

		if (!file) {
			return
		}

		setAvatarError('')

		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

		if (!allowedTypes.includes(file.type)) {
			setAvatarError('Можно загрузить только JPG, PNG или WEBP')
			return
		}

		const maxFileSize = 2 * 1024 * 1024

		if (file.size > maxFileSize) {
			setAvatarError('Размер файла не должен превышать 2 МБ')
			return
		}

		try {
			const { avatarUrl } = await uploadAvatarRequest(file)
			setAvatarUrl(avatarUrl)
		} catch (error) {
			setAvatarError(
				error instanceof Error ? error.message : 'Не удалось загрузить аватар',
			)
		}
	}

	return (
		<div
			onClick={close}
			className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm'
		>
			<div
				onClick={event => event.stopPropagation()}
				className='hide-scrollbar max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl'
			>
				<div className='flex items-center justify-between border-b border-slate-200 px-6 py-5'>
					<div>
						<h2 className='text-2xl font-bold tracking-tight text-slate-950'>
							Профиль
						</h2>
						<p className='mt-1 text-sm text-slate-500'>
							Данные пользователя и настройки аккаунта
						</p>
					</div>

					<button
						onClick={close}
						className='rounded-xl p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-700'
					>
						<X size={22} />
					</button>
				</div>

				<div className='p-6'>
					<div className='mb-6 rounded-3xl border border-blue-100 bg-blue-50/50 p-5'>
						<div className='flex items-center gap-4'>
							<div className='flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-white text-blue-700 shadow-sm ring-4 ring-white'>
								{avatarUrl ? (
									<img
										src={avatarUrl}
										alt='Аватар'
										className='h-full w-full object-cover'
									/>
								) : (
									<UserRound size={36} />
								)}
							</div>

							<div>
								<div className='text-lg font-bold text-slate-950'>
									{formatPhoneDisplay(user.phone)}
								</div>
								<div className='mt-1 text-sm text-slate-500'>
									Аккаунт покупателя NovaStore
								</div>

								<span className='mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm'>
									{user.role === 'ADMIN' ? 'Администратор' : 'Покупатель'}
								</span>
							</div>
						</div>
					</div>

					<div className='space-y-4'>
						<label className='block'>
							<span className='mb-1 block text-sm font-semibold text-slate-700'>
								Email для электронных чеков
							</span>
							<input
								value={email}
								onChange={event => setEmail(event.target.value)}
								placeholder='example@mail.com'
								className='w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50'
							/>
						</label>

						<label className='block'>
							<span className='mb-1 block text-sm font-semibold text-slate-700'>
								Аватар профиля
							</span>

							<input
								type='file'
								accept='image/png,image/jpeg,image/webp'
								onChange={handleAvatarChange}
								className='w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700 focus:border-blue-300 focus:ring-4 focus:ring-blue-50'
							/>

							<span className='mt-1 block text-xs text-slate-500'>
								Доступные форматы: JPG, PNG, WEBP. Максимальный размер файла — 2
								МБ.
							</span>

							{avatarError && (
								<div className='mt-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600'>
									{avatarError}
								</div>
							)}
						</label>
					</div>

					<div className='mt-6'>
						<div className='mb-3 flex items-center justify-between gap-3'>
							<h3 className='font-semibold text-slate-950'>История заказов</h3>

							<span className='rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700'>
								{orders.length} заказ(ов)
							</span>
						</div>

						{isOrdersLoading ? (
							<div className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500'>
								Загрузка заказов...
							</div>
						) : orders.length === 0 ? (
							<div className='rounded-3xl border border-dashed border-blue-200 bg-blue-50/50 px-5 py-6 text-center text-sm text-slate-500'>
								У пользователя пока нет оформленных заказов.
							</div>
						) : (
							<div className='max-h-64 space-y-3 overflow-y-auto pr-1'>
								{orders.map(order => (
									<div
										key={order.id}
										className='rounded-3xl border border-slate-200 bg-white p-4 shadow-sm'
									>
										<div className='mb-2 flex items-center justify-between gap-3'>
											<div className='font-bold text-slate-950'>
												Заказ №{order.id}
											</div>

											<OrderPaymentBadge order={order} />
										</div>

										<div className='mb-3 text-sm text-slate-500'>
											{new Date(order.createdAt).toLocaleString('ru-RU')}
										</div>

										<div className='space-y-1 text-sm text-slate-600'>
											{order.items.map(item => (
												<div
													key={item.id}
													className='flex justify-between gap-3'
												>
													<span className='line-clamp-1'>
														{item.product.title} × {item.quantity}
													</span>
												</div>
											))}
										</div>

										<div className='mt-3 rounded-2xl bg-blue-50 px-4 py-3 text-right font-bold text-slate-950'>
											{order.totalPrice.toLocaleString('ru-RU')} ₽
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					<div className='mt-6 flex flex-col gap-3 sm:flex-row'>
						<button
							onClick={handleSave}
							disabled={isLoading}
							className='flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300'
						>
							<Save size={18} />
							{isLoading ? 'Сохранение...' : 'Сохранить'}
						</button>

						<button
							onClick={handleLogout}
							className='flex flex-1 items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-50'
						>
							<LogOut size={18} />
							Выйти
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
