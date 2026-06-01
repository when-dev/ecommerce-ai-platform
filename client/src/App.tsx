import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminPage } from './pages/AdminPage'
import { HomePage } from './pages/HomePage'
import { useAuthStore } from './features/auth/authStore'
import { useEffect } from 'react'
import { getAccessToken } from './api/apiClient'
import { useCartStore } from './features/cart/cartStore'
import { useFavoritesStore } from './features/favorites/favoritesStore'

export function App() {
	const fetchMe = useAuthStore(state => state.fetchMe)
	const user = useAuthStore(state => state.user)
	const fetchCart = useCartStore(state => state.fetchCart)
	const fetchFavorites = useFavoritesStore(state => state.fetchFavorites)

	const resetCart = useCartStore(state => state.resetCart)
	const resetFavorites = useFavoritesStore(state => state.resetFavorites)

	useEffect(() => {
		if (getAccessToken()) {
			fetchMe()
		}
	}, [fetchMe])

	useEffect(() => {
		if (user) {
			fetchCart()
			fetchFavorites()
		}
	}, [user, fetchCart, fetchFavorites])

	useEffect(() => {
		if (!user) {
			resetCart()
			resetFavorites()
		}
	}, [user, resetCart, resetFavorites])

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/admin' element={<AdminPage />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
