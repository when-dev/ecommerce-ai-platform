import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, UserRound } from 'lucide-react'
import { useAuthModalStore } from '../features/auth/authModalStore'
import { useAuthStore } from '../features/auth/authStore'
import { useCartStore } from '../features/cart/cartStore'
import { useFavoritesStore } from '../features/favorites/favoritesStore'
import { useProfileModalStore } from '../features/profile/profileModalStore'
import { useAssistantStore } from '../features/assistant/assistantStore'
import { useDeliveryModalStore } from '../features/delivery/deliveryModalStore'
import { scrollToSection } from '../shared/scrollToSection'

export function Header() {
	const user = useAuthStore(state => state.user)
	const isAdmin = user?.role === 'ADMIN'
	const openAuthModal = useAuthModalStore(state => state.open)
	const openProfileModal = useProfileModalStore(state => state.open)

	const openCart = useCartStore(state => state.openCart)
	const totalItems = useCartStore(state =>
		state.items.reduce((sum, item) => sum + item.quantity, 0),
	)

	const openFavorites = useFavoritesStore(state => state.openFavorites)
	const favoriteItemsCount = useFavoritesStore(state => state.items.length)

	const openAssistant = useAssistantStore(state => state.openAssistant)
	const openDeliveryModal = useDeliveryModalStore(state => state.open)

	return (
		<header className='sticky top-0 z-40 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl'>
			<div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-4'>
				<div className='flex items-center gap-3'>
					<div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white shadow-sm'>
						N
					</div>

					<div className='text-2xl font-bold tracking-tight text-slate-950'>
						NovaStore
					</div>
				</div>

				<nav className='hidden items-center gap-2 rounded-2xl bg-slate-50 p-1 text-sm font-medium text-slate-600 md:flex'>
					<button
						onClick={() => scrollToSection('catalog')}
						className='rounded-xl px-4 py-2 transition hover:bg-white hover:text-blue-700 hover:shadow-sm'
					>
						Каталог
					</button>

					<button
						onClick={openDeliveryModal}
						className='rounded-xl px-4 py-2 transition hover:bg-white hover:text-blue-700 hover:shadow-sm'
					>
						Доставка
					</button>

					<button
						onClick={openAssistant}
						className='rounded-xl px-4 py-2 transition hover:bg-white hover:text-blue-700 hover:shadow-sm'
					>
						Помощь
					</button>

					{isAdmin && (
						<Link
							to='/admin'
							className='rounded-xl px-4 py-2 font-semibold text-blue-700 transition hover:bg-white hover:shadow-sm'
						>
							Админ-панель
						</Link>
					)}
				</nav>

				<div className='flex items-center gap-3'>
					<button
						onClick={openFavorites}
						className='relative flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
						aria-label='Открыть избранное'
					>
						<Heart size={20} />

						{favoriteItemsCount > 0 && (
							<span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white shadow-sm'>
								{favoriteItemsCount}
							</span>
						)}
					</button>

					<button
						onClick={openCart}
						className='relative flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
						aria-label='Открыть корзину'
					>
						<ShoppingCart size={20} />

						{totalItems > 0 && (
							<span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white shadow-sm'>
								{totalItems}
							</span>
						)}
					</button>

					{user ? (
						<button
							onClick={openProfileModal}
							className='flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
							aria-label='Открыть профиль'
						>
							{user.avatarUrl ? (
								<img
									src={user.avatarUrl}
									alt='Аватар'
									className='h-full w-full object-cover'
								/>
							) : (
								<UserRound size={22} />
							)}
						</button>
					) : (
						<button
							onClick={openAuthModal}
							className='flex h-12 items-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700'
						>
							<UserRound size={18} />
							Войти
						</button>
					)}
				</div>
			</div>
		</header>
	)
}
