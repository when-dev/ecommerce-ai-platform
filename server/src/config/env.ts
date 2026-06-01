import dotenv from 'dotenv'

dotenv.config()

export const env = {
	PORT: Number(process.env.PORT ?? 4000),
	DATABASE_URL: process.env.DATABASE_URL ?? '',
	JWT_SECRET: process.env.JWT_SECRET ?? 'secret',
	CLIENT_URL: process.env.CLIENT_URL ?? 'http://localhost:5173',

	OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY ?? '',
	OPENROUTER_MODEL: process.env.OPENROUTER_MODEL ?? 'openrouter/free',
	OPENROUTER_SITE_URL: process.env.OPENROUTER_SITE_URL ?? 'http://localhost:5173',
	OPENROUTER_SITE_NAME: process.env.OPENROUTER_SITE_NAME ?? 'NovaStore',
}