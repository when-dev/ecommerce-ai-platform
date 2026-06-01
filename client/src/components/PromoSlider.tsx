import { scrollToSection } from '../shared/scrollToSection'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const promos = [
	{
		title: 'Флагманы Apple',
		description:
			'Смартфоны с высокой производительностью, качественной камерой и премиальным дизайном.',
		tag: 'Apple',
		imageUrl: '/images/products/iphone-15-pro.png',
	},
	{
		title: 'Android-смартфоны',
		description:
			'Samsung, Xiaomi, Google Pixel и другие популярные модели для разных задач.',
		tag: 'Android',
		imageUrl: '/images/products/galaxy-s24.png',
	},
	{
		title: 'Лучшие по рейтингу',
		description:
			'Подборка моделей с высокой оценкой и оптимальным набором характеристик.',
		tag: 'Рейтинг',
		imageUrl: '/images/products/pixel-8.png',
	},
	{
		title: 'В наличии сегодня',
		description:
			'Товары, доступные для быстрого оформления заказа и добавления в корзину.',
		tag: 'Склад',
		imageUrl: '/images/products/xiaomi-14.png',
	},
	{
		title: 'Смартфоны до 50 000 ₽',
		description:
			'Модели с хорошим соотношением цены, производительности и качества камеры.',
		tag: 'Выгодно',
		imageUrl: '/images/products/redmi-note-13-pro.png',
	},
]

export function PromoSlider() {
	return (
		<section className='mb-12'>
			<div className='mb-5 flex items-end justify-between gap-4'>
				<div>
					<h2 className='text-2xl font-bold tracking-tight text-slate-950'>
						Специальные предложения
					</h2>
					<p className='mt-1 text-sm text-slate-500'>
						Подборки товаров для быстрого выбора
					</p>
				</div>
			</div>

			<Swiper
				modules={[Autoplay, Pagination]}
				loop
				pagination={{ clickable: true }}
				autoplay={{
					delay: 5000,
					disableOnInteraction: false,
				}}
				spaceBetween={18}
				slidesPerView={1}
				breakpoints={{
					640: {
						slidesPerView: 2,
					},
					1024: {
						slidesPerView: 3,
					},
				}}
				className='promo-swiper pb-12'
			>
				{promos.map(promo => (
					<SwiperSlide key={promo.title}>
						<article className='group h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:border-blue-200 hover:shadow-lg'>
							<div className='relative flex h-44 items-center justify-center overflow-hidden bg-linear-to-br from-slate-50 to-blue-50 px-6 py-5'>
								<img
									src={promo.imageUrl}
									alt={promo.title}
									className='h-full w-full object-contain transition duration-300 group-hover:scale-105'
								/>

								<div className='absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm ring-1 ring-blue-100'>
									{promo.tag}
								</div>
							</div>

							<div className='p-6'>
								<h3 className='text-xl font-bold tracking-tight text-slate-950'>
									{promo.title}
								</h3>

								<p className='mt-3 min-h-12 text-sm leading-6 text-slate-600'>
									{promo.description}
								</p>

								<button
									onClick={() => scrollToSection('catalog')}
									className='mt-5 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700'
								>
									Смотреть подборку
								</button>
							</div>
						</article>
					</SwiperSlide>
				))}
			</Swiper>
		</section>
	)
}
