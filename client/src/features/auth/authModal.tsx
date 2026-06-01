import { X } from 'lucide-react'
import { useState } from 'react'
import { useAuthModalStore } from './authModalStore'
import { useAuthStore } from './authStore'

type AuthMode = 'login' | 'register'

function formatPhoneInput(value: string) {
	const digits = value.replace(/\D/g, '')

	let normalizedDigits = digits

	if (normalizedDigits.startsWith('8')) {
		normalizedDigits = `7${normalizedDigits.slice(1)}`
	}

	if (!normalizedDigits.startsWith('7')) {
		normalizedDigits = `7${normalizedDigits}`
	}

	normalizedDigits = normalizedDigits.slice(0, 11)

	const country = normalizedDigits.slice(0, 1)
	const code = normalizedDigits.slice(1, 4)
	const first = normalizedDigits.slice(4, 7)
	const second = normalizedDigits.slice(7, 9)
	const third = normalizedDigits.slice(9, 11)

	let result = `+${country}`

	if (code) {
		result += ` (${code}`
	}

	if (code.length === 3) {
		result += ')'
	}

	if (first) {
		result += ` ${first}`
	}

	if (second) {
		result += `-${second}`
	}

	if (third) {
		result += `-${third}`
	}

	return result
}

function removePhoneDigitBeforeCaret(value: string, caretPosition: number) {
	const digits = value.replace(/\D/g, '')

	const digitsBeforeCaret = value
		.slice(0, caretPosition)
		.replace(/\D/g, '').length

	if (digitsBeforeCaret <= 1) {
		return formatPhoneInput(digits)
	}

	const digitIndexToRemove = digitsBeforeCaret - 1

	const nextDigits =
		digits.slice(0, digitIndexToRemove) + digits.slice(digitIndexToRemove + 1)

	return formatPhoneInput(nextDigits)
}

export function AuthModal() {
	const isOpen = useAuthModalStore(state => state.isOpen)
	const close = useAuthModalStore(state => state.close)

	const login = useAuthStore(state => state.login)
	const register = useAuthStore(state => state.register)
	const isLoading = useAuthStore(state => state.isLoading)

	const [mode, setMode] = useState<AuthMode>('login')
	const [phone, setPhone] = useState('')
	const [password, setPassword] = useState('')
	const [passwordConfirm, setPasswordConfirm] = useState('')
	const [error, setError] = useState('')

	if (!isOpen) {
		return null
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setError('')

		const phoneDigits = phone.replace(/\D/g, '')

		if (phoneDigits.length !== 11) {
			setError('Введите номер телефона полностью')
			return
		}

		if (password.length < 6) {
			setError('Пароль должен содержать минимум 6 символов')
			return
		}

		if (mode === 'register' && password !== passwordConfirm) {
			setError('Пароли не совпадают')
			return
		}

		try {
			if (mode === 'register') {
				await register(phone, password)
			} else {
				await login(phone, password)
			}

			close()
			setPhone('')
			setPassword('')
			setPasswordConfirm('')
			setMode('login')
		} catch (error) {
			setError(error instanceof Error ? error.message : 'Ошибка авторизации')
		}
	}

	function handlePhoneKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key !== 'Backspace') {
			return
		}

		const input = event.currentTarget
		const caretPosition = input.selectionStart ?? 0

		if (caretPosition === 0) {
			return
		}

		const previousChar = phone[caretPosition - 1]

		if (/\d/.test(previousChar)) {
			return
		}

		event.preventDefault()

		const nextPhone = removePhoneDigitBeforeCaret(phone, caretPosition)
		setPhone(nextPhone)
	}

	return (
		<div
			onClick={close}
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4'
		>
			<div
				onClick={event => event.stopPropagation()}
				className='w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl'
			>
				<div className='mb-6 flex items-center justify-between'>
					<div>
						<h2 className='text-2xl font-bold text-slate-900'>
							{mode === 'login' ? 'Вход' : 'Регистрация'}
						</h2>
						<p className='mt-1 text-sm text-slate-500'>
							{mode === 'login'
								? 'Войдите в аккаунт для оформления заказа'
								: 'Создайте аккаунт по номеру телефона'}
						</p>
					</div>

					<button
						onClick={close}
						className='rounded-xl p-2 text-slate-500 hover:bg-slate-100'
					>
						<X size={22} />
					</button>
				</div>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<label className='block'>
						<span className='mb-1 block text-sm font-medium text-slate-700'>
							Номер телефона
						</span>
						<input
							type='tel'
							inputMode='tel'
							value={phone}
							onChange={event => setPhone(formatPhoneInput(event.target.value))}
							onKeyDown={handlePhoneKeyDown}
							placeholder='+7 (999) 999-99-99'
							className='w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400'
						/>
					</label>

					<label className='block'>
						<span className='mb-1 block text-sm font-medium text-slate-700'>
							Пароль
						</span>
						<input
							value={password}
							onChange={event => setPassword(event.target.value)}
							type='password'
							placeholder='Минимум 6 символов'
							className='w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400'
						/>
					</label>

					{mode === 'register' && (
						<label className='block'>
							<span className='mb-1 block text-sm font-medium text-slate-700'>
								Повторите пароль
							</span>
							<input
								value={passwordConfirm}
								onChange={event => setPasswordConfirm(event.target.value)}
								type='password'
								placeholder='Повторите пароль'
								className='w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400'
							/>
						</label>
					)}

					{error && (
						<div className='rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600'>
							{error}
						</div>
					)}

					<button
						type='submit'
						disabled={isLoading}
						className='w-full rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300'
					>
						{isLoading
							? 'Загрузка...'
							: mode === 'login'
								? 'Войти'
								: 'Зарегистрироваться'}
					</button>
				</form>

				<div className='mt-5 text-center text-sm text-slate-600'>
					{mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
					<button
						onClick={() => {
							setError('')
							setMode(mode === 'login' ? 'register' : 'login')
						}}
						className='font-semibold text-slate-900 hover:underline'
					>
						{mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
					</button>
				</div>
			</div>
		</div>
	)
}
