export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export function getAccessToken() {
	return localStorage.getItem('accessToken')
}

export function setAccessToken(token: string) {
	localStorage.setItem('accessToken', token)
}

export function removeAccessToken() {
	localStorage.removeItem('accessToken')
}

export async function apiRequest<T>(
	path: string,
	options: RequestInit = {},
): Promise<T> {
	const token = getAccessToken()

	const response = await fetch(`${API_URL}${path}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...(options.headers ?? {}),
		},
	})

	if (!response.ok) {
		let message = 'Ошибка запроса'

		try {
			const data = await response.json()
			message = data.message ?? message
		} catch {
			message = response.statusText
		}

		throw new Error(message)
	}

	if (response.status === 204) {
		return null as T
	}

	return response.json()
}
