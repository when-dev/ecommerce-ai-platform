import { useMemo, useState, useEffect } from 'react'
import { ProductCard } from './ProductCard'
import { useProductsStore } from './productsStore'

export function ProductCatalog() {
	const products = useProductsStore(state => state.products)
	const isLoading = useProductsStore(state => state.isLoading)
	const error = useProductsStore(state => state.error)
	const fetchProducts = useProductsStore(state => state.fetchProducts)

	const [search, setSearch] = useState('')
	const [brand, setBrand] = useState('Все')
	const [sort, setSort] = useState('default')

	useEffect(() => {
		fetchProducts()
	}, [fetchProducts])

	const brands = ['Все', ...new Set(products.map(product => product.brand))]

	const filteredProducts = useMemo(() => {
		let result = [...products]

		if (search.trim()) {
			result = result.filter(product =>
				product.title.toLowerCase().includes(search.toLowerCase()),
			)
		}

		if (brand !== 'Все') {
			result = result.filter(product => product.brand === brand)
		}

		if (sort === 'price-asc') {
			result.sort((a, b) => a.price - b.price)
		}

		if (sort === 'price-desc') {
			result.sort((a, b) => b.price - a.price)
		}

		if (sort === 'rating-desc') {
			result.sort((a, b) => b.rating - a.rating)
		}

		return result
	}, [products, search, brand, sort])

	return (
		<section id='catalog' className='scroll-mt-24'>
			<div className='mb-5 flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between'>
				<input
					value={search}
					onChange={event => setSearch(event.target.value)}
					placeholder='Поиск по названию'
					className='w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400 md:max-w-sm'
				/>

				<div className='flex flex-col gap-3 sm:flex-row'>
					<select
						value={brand}
						onChange={event => setBrand(event.target.value)}
						className='rounded-2xl border border-slate-200 px-4 py-3 outline-none'
					>
						{brands.map(brandName => (
							<option key={brandName} value={brandName}>
								{brandName}
							</option>
						))}
					</select>

					<select
						value={sort}
						onChange={event => setSort(event.target.value)}
						className='rounded-2xl border border-slate-200 px-4 py-3 outline-none'
					>
						<option value='default'>По умолчанию</option>
						<option value='price-asc'>Сначала дешевле</option>
						<option value='price-desc'>Сначала дороже</option>
						<option value='rating-desc'>По рейтингу</option>
					</select>
				</div>
			</div>

			{isLoading && (
				<div className='rounded-3xl bg-white p-8 text-center text-slate-500'>
					Загрузка товаров...
				</div>
			)}

			{error && (
				<div className='rounded-3xl bg-red-50 p-8 text-center text-red-600'>
					{error}
				</div>
			)}

			{!isLoading && !error && (
				<div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
					{filteredProducts.map(product => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			)}

			{!isLoading && !error && filteredProducts.length === 0 && (
				<div className='rounded-3xl bg-white p-8 text-center text-slate-500'>
					Товары не найдены
				</div>
			)}
		</section>
	)
}
