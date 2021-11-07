import { Schema } from 'mongoose'
import { IEventSchema } from '../interfaces/schema.interface'

export const Event = new Schema<IEventSchema>({
	title: String,
	description: String,
	event_image: String,
	location: String,
	max_visitors: Number,
	date_start: Date,
	time_start: Date,
	user_id: { type: Schema.Types.ObjectId, ref: 'User' },
	created_at: Date,
	updated_at: Date
})