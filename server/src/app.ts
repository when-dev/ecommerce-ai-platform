import express from 'express'
import cors from 'cors'
import path from 'path'
import { pool } from './db/pool.js'
import { productsRouter } from './modules/products/products.routes.js'
import { authRouter } from './modules/auth/auth.routes.js'
import { cartRouter } from './modules/cart/cart.routes.js'
import { favoritesRouter } from './modules/favorites/favorites.routes.js'
import { ordersRouter } from './modules/orders/orders.routes.js'
import { assistantRouter } from './modules/assistant/assistant.routes.js'
import { uploadsRouter } from './modules/uploads/uploads.routes.js'

export const app = express()

const allowedOrigins = [
	'http://localhost:5173',
	process.env.CLIENT_URL,
].filter(Boolean)

app.use(
	cors({
		origin(origin, callback) {
			if (!origin) {
				callback(null, true)
				return
			}

			if (allowedOrigins.includes(origin)) {
				callback(null, true)
				return
			}

			console.log('Blocked by CORS:', origin)
			callback(new Error('Not allowed by CORS'))
		},
		credentials: true,
	}),
)

app.use(express.json())

app.use('/uploads', express.static(path.resolve('uploads')))

app.use('/auth', authRouter)
app.use('/products', productsRouter)
app.use('/cart', cartRouter)
app.use('/favorites', favoritesRouter)
app.use('/orders', ordersRouter)
app.use('/assistant', assistantRouter)
app.use('/uploads', uploadsRouter)

app.get('/health', async (_req, res) => {
	const dbResult = await pool.query('SELECT NOW()')

	res.json({
		status: 'ok',
		databaseTime: dbResult.rows[0].now,
	})
})
