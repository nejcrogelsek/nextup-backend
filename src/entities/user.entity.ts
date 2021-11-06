import { Schema } from 'mongoose'
import { IUserSchema } from '../interfaces/schema.interface'

export const User = new Schema<IUserSchema>({
	profile_image: String,
	first_name: String,
	last_name: String,
	email: {
		type: String,
		index: true,
		unique: true
	},
	email_token: String,
	confirmed: Boolean,
	password: String,
	created_at: Date,
	updated_at: Date
})