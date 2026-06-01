import { type FormEvent, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Edit, Plus, Trash2 } from 'lucide-react'
import type { Product } from '../types/product'
import { useAuthStore } from '../features/auth/authStore'
import { useAuthModalStore } from '../features/auth/authModalStore'
import { useProductsStore } from '../features/products/productsStore'
import { AuthModal } from '../features/auth/authModal'

type ProductFormState = {
	title: string
	brand: string
	category: string
	price: string
	imageUrl: string
	description: string
	rating: string
	stock: string
	specsText: string
}

const initialFormState: ProductFormState = {
	title: '',
	brand: '',
	category: 'Смартфоны',
	price: '',
	imageUrl: 'https://placehold.co/400x300?text=New+Product',
	description: '',
	rating: '4.5',
	stock: '10',
	specsText: 'Экран: 6.1 дюйма\nПамять: 128 ГБ\nКамера: 48 Мп',
}

function productToForm(product: Product): ProductFormState {
	return {
		title: product.title,
		brand: product.brand,
		category: product.category,
		price: String(product.price),
		imageUrl: product.imageUrl,
		description: product.description,
		rating: String(product.rating),
		stock: String(product.stock),
		specsText: product.specs
			.map(spec => `${spec.label}: ${spec.value}`)
			.join('\n'),
	}
}

function parseSpecs(specsText: string) {
	return specsText
		.split('\n')
		.map(line => line.trim())
		.filter(Boolean)
		.map(line => {
			const [label, ...valueParts] = line.split(':')

			return {
				label: label.trim(),
				value: valueParts.join(':').trim() || '—',
			}
		})
}

export function AdminPage() {
	const user = useAuthStore(state => state.user)
	const openAuthModal = useAuthModalStore(state => state.open)

	const products = useProductsStore(state => state.products)
	const isLoading = useProductsStore(state => state.isLoading)
	const productsError = useProductsStore(state => state.error)
	const fetchProducts = useProductsStore(state => state.fetchProducts)
	const addProduct = useProductsStore(state => state.addProduct)
	const updateProduct = useProductsStore(state => state.updateProduct)
	const deleteProduct = useProductsStore(state => state.deleteProduct)

	const [form, setForm] = useState<ProductFormState>(initialFormState)
	const [editingProductId, setEditingProductId] = useState<number | null>(null)
	const [error, setError] = useState('')

	useEffect(() => {
		fetchProducts()
	}, [fetchProducts])

	const isAdmin = user?.role === 'ADMIN'

	function updateField(field: keyof ProductFormState, value: string) {
		setForm(prev => ({
			...prev,
			[field]: value,
		}))
	}

	function resetForm() {
		setForm(initialFormState)
		setEditingProductId(null)
		setError('')
	}

	function handleEdit(product: Product) {
		setEditingProductId(product.id)
		setForm(productToForm(product))
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setError('')

		if (!form.title.trim()) {
			setError('Введите название товара')
			return
		}

		if (!form.brand.trim()) {
			setError('Введите бренд товара')
			return
		}

		if (!form.description.trim()) {
			setError('Введите описание товара')
			return
		}

		const price = Number(form.price)
		const rating = Number(form.rating)
		const stock = Number(form.stock)

		if (!Number.isFinite(price) || price <= 0) {
			setError('Введите корректную цену')
			return
		}

		if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
			setError('Рейтинг должен быть от 0 до 5')
			return
		}

		if (!Number.isFinite(stock) || stock < 0) {
			setError('Введите корректное количество товара')
			return
		}

		const productData = {
			title: form.title.trim(),
			brand: form.brand.trim(),
			category: form.category.trim(),
			price,
			imageUrl: form.imageUrl.trim(),
			description: form.description.trim(),
			rating,
			stock,
			specs: parseSpecs(form.specsText),
		}

		try {
			if (editingProductId) {
				await updateProduct(editingProductId, productData)
			} else {
				await addProduct(productData)
			}

			resetForm()
		} catch (error) {
			setError(
				error instanceof Error ? error.message : 'Не удалось сохранить товар',
			)
		}
	}

	if (!user) {
		return (
			<div className='min-h-screen bg-slate-100 px-4 py-10'>
				<div className='mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm'>
					<h1 className='mb-3 text-2xl font-bold text-slate-900'>
						Админ-панель
					</h1>

					<p className='mb-6 text-slate-600'>
						Для доступа к управлению товарами необходимо войти в аккаунт
						администратора.
					</p>

					<button
						onClick={openAuthModal}
						className='rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800'
					>
						Войти
					</button>

					<div className='mt-5'>
						<Link to='/' className='text-sm text-slate-500 hover:underline'>
							Вернуться в магазин
						</Link>
					</div>
				</div>
				<AuthModal />
			</div>
		)
	}

	if (!isAdmin) {
		return (
			<div className='min-h-screen bg-slate-100 px-4 py-10'>
				<div className='mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm'>
					<h1 className='mb-3 text-2xl font-bold text-slate-900'>
						Доступ ограничен
					</h1>

					<p className='mb-6 text-slate-600'>
						Управление товарами доступно только пользователю с ролью
						администратора.
					</p>

					<Link
						to='/'
						className='rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800'
					>
						Вернуться в магазин
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-slate-100'>
			<header className='border-b border-slate-200 bg-white'>
				<div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-4'>
					<div>
						<h1 className='text-2xl font-bold text-slate-900'>Админ-панель</h1>
						<p className='text-sm text-slate-500'>
							Управление товарами e-commerce платформы
						</p>
					</div>

					<Link
						to='/'
						className='rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium hover:bg-slate-50'
					>
						В магазин
					</Link>
				</div>
			</header>

			<main className='mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[420px_1fr]'>
				<section className='h-fit rounded-3xl bg-white p-6 shadow-sm'>
					<h2 className='mb-5 text-xl font-bold text-slate-900'>
						{editingProductId ? 'Редактирование товара' : 'Добавление товара'}
					</h2>

					<form onSubmit={handleSubmit} className='space-y-4'>
						<label className='block'>
							<span className='mb-1 block text-sm font-medium text-slate-700'>
								Название
							</span>
							<input
								value={form.title}
								onChange={event => updateField('title', event.target.value)}
								className='w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400'
								placeholder='Например, iPhone 15 Pro'
							/>
						</label>

						<div className='grid gap-3 sm:grid-cols-2'>
							<label className='block'>
								<span className='mb-1 block text-sm font-medium text-slate-700'>
									Бренд
								</span>
								<input
									value={form.brand}
									onChange={event => updateField('brand', event.target.value)}
									className='w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400'
									placeholder='Apple'
								/>
							</label>

							<label className='block'>
								<span className='mb-1 block text-sm font-medium text-slate-700'>
									Категория
								</span>
								<input
									value={form.category}
									onChange={event =>
										updateField('category', event.target.value)
									}
									className='w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400'
									placeholder='Смартфоны'
								/>
							</label>
						</div>

						<div className='grid gap-3 sm:grid-cols-3'>
							<label className='block'>
								<span className='mb-1 block text-sm font-medium text-slate-700'>
									Цена
								</span>
								<input
									value={form.price}
									onChange={event => updateField('price', event.target.value)}
									className='w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400'
									placeholder='99990'
								/>
							</label>

							<label className='block'>
								<span className='mb-1 block text-sm font-medium text-slate-700'>
									Рейтинг
								</span>
								<input
									value={form.rating}
									onChange={event => updateField('rating', event.target.value)}
									className='w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400'
									placeholder='4.8'
								/>
							</label>

							<label className='block'>
								<span className='mb-1 block text-sm font-medium text-slate-700'>
									Наличие
								</span>
								<input
									value={form.stock}
									onChange={event => updateField('stock', event.target.value)}
									className='w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400'
									placeholder='10'
								/>
							</label>
						</div>

						<label className='block'>
							<span className='mb-1 block text-sm font-medium text-slate-700'>
								Ссылка на изображение
							</span>
							<input
								value={form.imageUrl}
								onChange={event => updateField('imageUrl', event.target.value)}
								className='w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400'
								placeholder='https://...'
							/>
						</label>

						<label className='block'>
							<span className='mb-1 block text-sm font-medium text-slate-700'>
								Описание
							</span>
							<textarea
								value={form.description}
								onChange={event =>
									updateField('description', event.target.value)
								}
								className='min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400'
								placeholder='Краткое описание товара'
							/>
						</label>

						<label className='block'>
							<span className='mb-1 block text-sm font-medium text-slate-700'>
								Характеристики
							</span>
							<textarea
								value={form.specsText}
								onChange={event => updateField('specsText', event.target.value)}
								className='min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400'
								placeholder={'Экран: 6.1 дюйма\nПамять: 128 ГБ'}
							/>
							<span className='mt-1 block text-xs text-slate-500'>
								Каждая характеристика с новой строки в формате: Название:
								значение
							</span>
						</label>

						{error && (
							<div className='rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600'>
								{error}
							</div>
						)}

						<div className='flex gap-3'>
							<button
								type='submit'
								className='flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-800'
							>
								{editingProductId ? <Edit size={18} /> : <Plus size={18} />}
								{editingProductId ? 'Сохранить' : 'Добавить'}
							</button>

							{editingProductId && (
								<button
									type='button'
									onClick={resetForm}
									className='rounded-2xl border border-slate-200 px-4 py-3 font-medium hover:bg-slate-50'
								>
									Отмена
								</button>
							)}
						</div>
					</form>
				</section>

				<section className='rounded-3xl bg-white p-6 shadow-sm'>
					<h2 className='mb-5 text-xl font-bold text-slate-900'>
						Список товаров
					</h2>

					{isLoading && (
						<div className='rounded-2xl bg-slate-50 p-5 text-center text-slate-500'>
							Загрузка товаров...
						</div>
					)}

					{productsError && (
						<div className='rounded-2xl bg-red-50 p-5 text-center text-red-600'>
							{productsError}
						</div>
					)}
					{!isLoading && !productsError && (
						<div className='space-y-4'>
							{products.map(product => (
								<div
									key={product.id}
									className='grid gap-4 rounded-2xl border border-slate-200 p-4 md:grid-cols-[96px_1fr_auto]'
								>
									<img
										src={product.imageUrl}
										alt={product.title}
										className='h-24 w-24 rounded-2xl object-cover'
									/>

									<div>
										<h3 className='font-semibold text-slate-900'>
											{product.title}
										</h3>
										<p className='mt-1 text-sm text-slate-500'>
											{product.brand} · {product.category}
										</p>
										<p className='mt-2 line-clamp-2 text-sm text-slate-600'>
											{product.description}
										</p>
										<div className='mt-2 font-bold text-slate-900'>
											{product.price.toLocaleString('ru-RU')} ₽
										</div>
									</div>

									<div className='flex items-start gap-2'>
										<button
											onClick={() => handleEdit(product)}
											className='rounded-xl border border-slate-200 p-3 hover:bg-slate-50'
										>
											<Edit size={18} />
										</button>

										<button
											onClick={async () => {
												if (!confirm('Удалить товар?')) {
													return
												}

												try {
													await deleteProduct(product.id)
												} catch (error) {
													alert(
														error instanceof Error
															? error.message
															: 'Не удалось удалить товар',
													)
												}
											}}
											className='rounded-xl border border-slate-200 p-3 text-red-500 hover:bg-red-50'
										>
											<Trash2 size={18} />
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</section>
			</main>
		</div>
	)
}
