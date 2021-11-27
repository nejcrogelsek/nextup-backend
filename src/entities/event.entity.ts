import { Schema } from 'mongoose'
import { IEventSchema } from '../interfaces/schema.interface'

export const Event = new Schema<IEventSchema>({
	title: String,
	description: String,
	event_image: String,
	location: String,
	max_visitors: Number,
	date_start: String,
	time_start: String,
	user_id: { type: Schema.Types.ObjectId, ref: 'User' },
	url: String,
	created_at: Date,
	updated_at: Date
})