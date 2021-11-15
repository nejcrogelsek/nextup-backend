import { Schema } from 'mongoose'
import { IReservationSchema } from '../interfaces/schema.interface'

export const Reservation = new Schema<IReservationSchema>({
	user_id: String,
	event_id: String,
	created_at: Date
})