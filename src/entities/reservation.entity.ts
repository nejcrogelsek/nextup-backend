import { Schema } from 'mongoose'
import { IReservationSchema } from '../interfaces/schema.interface'

export const Reservation = new Schema<IReservationSchema>({
	user_id: Number,
	event_id: Number,
	created_at: Date
})