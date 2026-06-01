import { Headphones, Laptop, Smartphone, Watch } from 'lucide-react'

const categories = [
	{
		title: 'Смартфоны',
		description: 'Флагманы и модели среднего сегмента',
		icon: Smartphone,
	},
	{
		title: 'Ноутбуки',
		description: 'Для работы, учебы и повседневных задач',
		icon: Laptop,
	},
	{
		title: 'Аксессуары',
		description: 'Наушники, зарядные устройства и кабели',
		icon: Headphones,
	},
	{
		title: 'Умные часы',
		description: 'Устройства для спорта и уведомлений',
		icon: Watch,
	},
]

export function CategorySection() {
	return (
		<section className='mb-10'>
			<div className='mb-5'>
				<h2 className='text-2xl font-bold tracking-tight text-slate-950'>
					Категории
				</h2>
				<p className='mt-1 text-sm text-slate-500'>
					Основные разделы каталога товаров
				</p>
			</div>

			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				{categories.map(category => {
					const Icon = category.icon

					return (
						<article
							key={category.title}
							className='group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-lg'
						>
							<div className='mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white'>
								<Icon size={24} />
							</div>

							<h3 className='font-bold text-slate-950'>{category.title}</h3>

							<p className='mt-2 text-sm leading-6 text-slate-600'>
								{category.description}
							</p>
						</article>
					)
				})}
			</div>
		</section>
	)
}
