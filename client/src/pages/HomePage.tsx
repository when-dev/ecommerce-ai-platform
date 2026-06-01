import { Header } from '../components/Header'
import { AuthModal } from '../features/auth/authModal'
import { AssistantWidget } from '../features/assistant/AssistantWidget'
import { CartDrawer } from '../features/cart/CartDrawer'
import { CheckoutModal } from '../features/orders/CheckoutModal'
import { FavoritesDrawer } from '../features/favorites/FavoritesDrawer'
import { ProductCatalog } from '../features/products/ProductCatalog'
import { ProductDetailsModal } from '../features/products/ProductDetailsModal'
import { ProfileModal } from '../features/profile/ProfileModal'
import { DeliveryModal } from '../features/delivery/DeliveryModal'
import { Footer } from '../components/Footer'
import { PromoSlider } from '../components/PromoSlider'
import { CategorySection } from '../components/CategorySection'
import { scrollToSection } from '../shared/scrollToSection'
import { PaymentModal } from '../features/payment/PaymentModal'

export function HomePage() {
	return (
		<div className='min-h-screen bg-slate-50'>
			<Header />

			<main className='mx-auto max-w-7xl px-4 py-6'>
				<section className='mb-8 grid gap-5 lg:grid-cols-[1.4fr_0.8fr]'>
					<div className='relative overflow-hidden rounded-4xl bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white shadow-sm'>
						<div className='absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl' />
						<div className='absolute -bottom-24 left-24 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl' />

						<div className='relative'>
							<div className='mb-4 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-blue-100'>
								Новая коллекция смартфонов
							</div>

							<h1 className='max-w-2xl text-4xl font-bold leading-tight tracking-tight md:text-5xl'>
								Техника для работы, учёбы и повседневных задач
							</h1>

							<p className='mt-4 max-w-xl text-base leading-7 text-slate-300'>
								Смартфоны популярных брендов, быстрый подбор, удобная корзина и
								оформление заказа в несколько шагов.
							</p>

							<div className='mt-7 flex flex-wrap gap-3'>
								<button
									onClick={() => scrollToSection('catalog')}
									className='rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700'
								>
									Перейти к каталогу
								</button>

								<button
									onClick={() => scrollToSection('catalog')}
									className='rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10'
								>
									Акции недели
								</button>
							</div>
						</div>
					</div>

					<div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-1'>
						<div className='rounded-4xl border border-blue-100 bg-blue-50 p-6 shadow-sm'>
							<p className='text-sm font-semibold text-blue-700'>Скидки до</p>
							<div className='mt-2 text-5xl font-bold tracking-tight text-slate-950'>
								25%
							</div>
							<p className='mt-3 text-sm leading-6 text-slate-600'>
								На отдельные модели смартфонов и аксессуары.
							</p>
						</div>

						<div className='rounded-4xl border border-slate-200 bg-white p-6 shadow-sm'>
							<p className='text-sm font-semibold text-slate-500'>
								Быстрое оформление
							</p>
							<div className='mt-2 text-3xl font-bold tracking-tight text-slate-950'>
								Заказ за 2 минуты
							</div>
							<p className='mt-3 text-sm leading-6 text-slate-600'>
								Добавьте товар в корзину, укажите адрес и подтвердите заказ.
							</p>
						</div>
					</div>
				</section>

				<PromoSlider />

				<CategorySection />

				<ProductCatalog />

				<section className='mt-12 grid gap-5 md:grid-cols-3'>
					<div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-lg'>
						<div className='mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700'>
							01
						</div>

						<h3 className='mb-2 text-lg font-bold text-slate-950'>
							Подбор по параметрам
						</h3>
						<p className='text-sm leading-6 text-slate-600'>
							Используйте поиск, фильтры по бренду и сортировку по цене или
							рейтингу.
						</p>
					</div>

					<div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-lg'>
						<div className='mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700'>
							02
						</div>

						<h3 className='mb-2 text-lg font-bold text-slate-950'>
							История заказов
						</h3>
						<p className='text-sm leading-6 text-slate-600'>
							После оформления заказа пользователь может посмотреть его статус в
							профиле.
						</p>
					</div>

					<div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-lg'>
						<div className='mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700'>
							03
						</div>

						<h3 className='mb-2 text-lg font-bold text-slate-950'>
							Поддержка покупателей
						</h3>
						<p className='text-sm leading-6 text-slate-600'>
							Раздел помощи позволяет быстро получить ответ на популярные
							вопросы по заказу, профилю и корзине.
						</p>
					</div>
				</section>
			</main>

			<Footer />

			<CartDrawer />
			<FavoritesDrawer />
			<AssistantWidget />
			<AuthModal />
			<ProfileModal />
			<CheckoutModal />
			<ProductDetailsModal />
			<DeliveryModal />
			<PaymentModal />
		</div>
	)
}
