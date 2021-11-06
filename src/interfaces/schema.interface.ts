export interface IUserSchema {
	_id: string
	profile_image: string
	first_name: string
	last_name: string
	email: string
	email_token: string | null
	confirmed: boolean
	password: string
	created_at: Date
	updated_at: Date
}
export interface IEventSchema {
	_id: string
	title: string
	description: string
	event_image: string
	location: string
	max_visitors: number
	user_id: number
	date_start: Date
	time_start: Date
	created_at: Date
	updated_at: Date
}

export interface IReservationSchema {
	_id: string
	user_id: number
	event_id: number
	created_at: Date
}