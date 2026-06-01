import { Clock, MapPin, PackageCheck, Truck, X } from 'lucide-react'
import { useDeliveryModalStore } from './deliveryModalStore'

export function DeliveryModal() {
	const isOpen = useDeliveryModalStore(state => state.isOpen)
	const close = useDeliveryModalStore(state => state.close)

	if (!isOpen) {
		return null
	}

	return (
		<div
			onClick={close}
			className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm'
		>
			<div
				onClick={event => event.stopPropagation()}
				className='w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl'
			>
				<div className='flex items-center justify-between border-b border-slate-200 px-6 py-5'>
					<div className='flex items-center gap-3'>
						<div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700'>
							<Truck size={24} />
						</div>

						<div>
							<h2 className='text-2xl font-bold text-slate-950'>
								Доставка и получение
							</h2>
							<p className='mt-1 text-sm text-slate-500'>
								Условия доставки заказов NovaStore
							</p>
						</div>
					</div>

					<button
						onClick={close}
						className='rounded-xl p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-700'
					>
						<X size={22} />
					</button>
				</div>

				<div className='space-y-4 p-6'>
					<div className='rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'>
						<div className='mb-3 flex items-center gap-3'>
							<div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700'>
								<MapPin size={20} />
							</div>

							<h3 className='font-bold text-slate-950'>Курьерская доставка</h3>
						</div>

						<p className='text-sm leading-6 text-slate-600'>
							Пользователь указывает адрес при оформлении заказа. После
							подтверждения заказ сохраняется в системе и получает начальный
							статус.
						</p>
					</div>

					<div className='grid gap-4 sm:grid-cols-2'>
						<div className='rounded-3xl border border-slate-200 bg-blue-50/50 p-5'>
							<div className='mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm'>
								<Clock size={20} />
							</div>

							<h3 className='font-bold text-slate-950'>Сроки</h3>
							<p className='mt-2 text-sm leading-6 text-slate-600'>
								В учебной версии срок доставки отображается как информационный
								сценарий и может быть расширен в дальнейшем.
							</p>
						</div>

						<div className='rounded-3xl border border-slate-200 bg-emerald-50/50 p-5'>
							<div className='mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm'>
								<PackageCheck size={20} />
							</div>

							<h3 className='font-bold text-slate-950'>Статусы заказа</h3>
							<p className='mt-2 text-sm leading-6 text-slate-600'>
								История заказов и текущий статус доступны пользователю в
								профиле после оформления заказа.
							</p>
						</div>
					</div>

					<div className='rounded-3xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm leading-6 text-blue-800'>
						В дальнейшем платформа может быть расширена пунктами выдачи,
						расчетом стоимости доставки и интеграцией с внешними логистическими
						сервисами.
					</div>
				</div>
			</div>
		</div>
	)
}