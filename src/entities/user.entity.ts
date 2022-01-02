import { Schema } from 'mongoose'
import { IUserSchema } from '../interfaces/schema.interface'

export const User = new Schema<IUserSchema>({
	uid: String,
	profile_image: String,
	first_name: String,
	last_name: String,
	email: {
		type: String,
		index: true,
		unique: true
	},
	events: [{ type: Schema.Types.ObjectId, ref:'Event' }],
	created_at: Date,
	updated_at: Date
})