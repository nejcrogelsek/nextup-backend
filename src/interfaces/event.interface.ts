export interface IEvent {
	_id: string
	title: string
	description: string
	location: string
	event_image: string
	max_visitors: number
	user_id: string
	date_start: string
	time_start: string
	url: string
	created_at: Date
	updated_at: Date
}

export interface IReservation {
	_id: string
	user_id: string
	event_id: string
	created_at: Date
}