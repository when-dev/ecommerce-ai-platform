export function formatPhoneDisplay(phone: string) {
	const digits = phone.replace(/\D/g, '')

	if (digits.length !== 11) {
		return phone
	}

	const country = digits.slice(0, 1)
	const code = digits.slice(1, 4)
	const first = digits.slice(4, 7)
	const second = digits.slice(7, 9)
	const third = digits.slice(9, 11)

	return `+${country} (${code}) ${first}-${second}-${third}`
}