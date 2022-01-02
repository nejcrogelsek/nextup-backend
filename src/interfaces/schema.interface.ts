import * as mongoose from "mongoose";

export interface IUserSchema {
	_id: string
	uid: string
	profile_image: string
	first_name: string
	last_name: string
	email: string
	events: mongoose.Schema.Types.ObjectId
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
	user_id: mongoose.Schema.Types.ObjectId
	date_start: string
	time_start: string
	url: string
	created_at: Date
	updated_at: Date
}

export interface IReservationSchema {
	_id: string
	user_id: number
	event_id: number
	created_at: Date
}