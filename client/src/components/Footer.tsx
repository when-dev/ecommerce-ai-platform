export function Footer() {
	return (
		<footer className='mt-12 border-t border-slate-200 bg-white'>
			<div className='mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]'>
				<div>
					<div className='flex items-center gap-3'>
						<div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white shadow-sm'>
							N
						</div>

						<div className='text-2xl font-bold tracking-tight text-slate-950'>
							NovaStore
						</div>
					</div>

					<p className='mt-4 max-w-sm text-sm leading-6 text-slate-600'>
						Онлайн-магазин электроники.
					</p>
				</div>

				<div>
					<h3 className='mb-4 font-semibold text-slate-950'>Покупателям</h3>
					<ul className='space-y-3 text-sm text-slate-600'>
						<li className='transition hover:text-blue-600'>Каталог товаров</li>
						<li className='transition hover:text-blue-600'>Доставка</li>
						<li className='transition hover:text-blue-600'>Оплата</li>
						<li className='transition hover:text-blue-600'>Возврат</li>
					</ul>
				</div>

				<div>
					<h3 className='mb-4 font-semibold text-slate-950'>Сервис</h3>
					<ul className='space-y-3 text-sm text-slate-600'>
						<li className='transition hover:text-blue-600'>Профиль</li>
						<li className='transition hover:text-blue-600'>История заказов</li>
						<li className='transition hover:text-blue-600'>Избранное</li>
						<li className='transition hover:text-blue-600'>Поддержка</li>
					</ul>
				</div>

				<div>
					<h3 className='mb-4 font-semibold text-slate-950'>Контакты</h3>
					<ul className='space-y-3 text-sm text-slate-600'>
						<li>support@novastore.local</li>
						<li>+7 000 000-00-00</li>
						<li>Ежедневно с 9:00 до 21:00</li>
					</ul>

					<div className='mt-5 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700'>
						Поддержка доступна через раздел помощи на сайте.
					</div>
				</div>
			</div>

		</footer>
	)
}