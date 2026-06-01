import { CreditCard, Lock, X } from 'lucide-react'
import { useState } from 'react'
import { payOrderRequest } from '../orders/ordersApi.ts'
import { useOrderStore } from '../orders/orderStore'
import { usePaymentModalStore } from './paymentModalStore'

function formatCardNumber(value: string) {
	const digits = value.replace(/\D/g, '').slice(0, 16)

	return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

function formatExpiry(value: string) {
	const digits = value.replace(/\D/g, '').slice(0, 4)

	if (digits.length <= 2) {
		return digits
	}

	return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export function PaymentModal() {
	const isOpen = usePaymentModalStore(state => state.isOpen)
	const orderId = usePaymentModalStore(state => state.orderId)
	const close = usePaymentModalStore(state => state.close)

	const fetchOrders = useOrderStore(state => state.fetchOrders)

	const [cardNumber, setCardNumber] = useState('')
	const [cardHolder, setCardHolder] = useState('')
	const [expiry, setExpiry] = useState('')
	const [cvv, setCvv] = useState('')
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)

	if (!isOpen || !orderId) {
		return null
	}

	function handleClose() {
		setCardNumber('')
		setCardHolder('')
		setExpiry('')
		setCvv('')
		setError('')
		setIsLoading(false)
		setIsSuccess(false)
		close()
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setError('')

		const cleanCardNumber = cardNumber.replace(/\D/g, '')
		const cleanCvv = cvv.replace(/\D/g, '')

		if (cleanCardNumber.length !== 16) {
			setError('Введите 16 цифр номера карты')
			return
		}

		if (cardHolder.trim().length < 3) {
			setError('Введите имя держателя карты')
			return
		}

		if (!/^\d{2}\/\d{2}$/.test(expiry)) {
			setError('Введите срок действия карты в формате MM/YY')
			return
		}

		if (cleanCvv.length !== 3) {
			setError('Введите CVV из 3 цифр')
			return
		}

		try {
			setIsLoading(true)

			await payOrderRequest(orderId)
			await fetchOrders()

			setIsSuccess(true)
		} catch (error) {
			setError(
				error instanceof Error ? error.message : 'Не удалось подтвердить оплату',
			)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div
			onClick={handleClose}
			className='fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm'
		>
			<div
				onClick={event => event.stopPropagation()}
				className='w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl'
			>
				<div className='flex items-center justify-between border-b border-slate-200 px-6 py-5'>
					<div className='flex items-center gap-3'>
						<div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700'>
							<CreditCard size={24} />
						</div>

						<div>
							<h2 className='text-2xl font-bold tracking-tight text-slate-950'>
								Онлайн-оплата
							</h2>
						</div>
					</div>

					<button
						onClick={handleClose}
						className='rounded-xl p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-700'
					>
						<X size={22} />
					</button>
				</div>

				{isSuccess ? (
					<div className='p-6'>
						<div className='rounded-3xl border border-emerald-100 bg-emerald-50 px-5 py-5 text-emerald-700'>
							<div className='font-bold'>Оплата успешно подтверждена</div>
							<p className='mt-2 text-sm leading-6'>
								Заказ получил статус «Оплачен». Информацию можно посмотреть в
								профиле пользователя.
							</p>
						</div>

						<button
							onClick={handleClose}
							className='mt-5 w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700'
						>
							Закрыть
						</button>
					</div>
				) : (
					<form onSubmit={handleSubmit} className='space-y-4 p-6'>
						

						<label className='block'>
							<span className='mb-1 block text-sm font-semibold text-slate-700'>
								Номер карты
							</span>
							<input
								value={cardNumber}
								onChange={event =>
									setCardNumber(formatCardNumber(event.target.value))
								}
								placeholder='0000 0000 0000 0000'
								inputMode='numeric'
								className='w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50'
							/>
						</label>

						<label className='block'>
							<span className='mb-1 block text-sm font-semibold text-slate-700'>
								Держатель карты
							</span>
							<input
								value={cardHolder}
								onChange={event => setCardHolder(event.target.value)}
								placeholder='IVAN IVANOV'
								className='w-full rounded-2xl border border-slate-200 px-4 py-3 uppercase outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50'
							/>
						</label>

						<div className='grid gap-4 sm:grid-cols-2'>
							<label className='block'>
								<span className='mb-1 block text-sm font-semibold text-slate-700'>
									Срок действия
								</span>
								<input
									value={expiry}
									onChange={event => setExpiry(formatExpiry(event.target.value))}
									placeholder='MM/YY'
									inputMode='numeric'
									className='w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50'
								/>
							</label>

							<label className='block'>
								<span className='mb-1 block text-sm font-semibold text-slate-700'>
									CVV
								</span>
								<input
									value={cvv}
									onChange={event =>
										setCvv(event.target.value.replace(/\D/g, '').slice(0, 3))
									}
									placeholder='123'
									inputMode='numeric'
									className='w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50'
								/>
							</label>
						</div>

						{error && (
							<div className='rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600'>
								{error}
							</div>
						)}

						<button
							type='submit'
							disabled={isLoading}
							className='flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300'
						>
							<Lock size={18} />
							{isLoading ? 'Проверка оплаты...' : 'Подтвердить оплату'}
						</button>
					</form>
				)}
			</div>
		</div>
	)
}