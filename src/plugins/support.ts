import fp from 'fastify-plugin'
import { User } from '../entities/user.entity'
import * as mongoose from 'mongoose'
import { IUser } from '../interfaces/user.interface'
import fastifyJwt from 'fastify-jwt'
import { fastifyRequestContextPlugin } from 'fastify-request-context'
import { Event } from '../entities/event.entity'
import { IEvent, IReservation } from '../interfaces/event.interface'
import { Reservation } from '../entities/reservation.entity'

export interface SupportPluginOptions {
	// Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, opts) => {
	fastify.register(fastifyRequestContextPlugin)

	fastify.register(fastifyJwt, {
		secret: 'supersecret',
		sign: {
			expiresIn: '15 minutes'
		}
	})

	fastify.decorate('generateJwt', (email: string) => {
		return fastify.jwt.sign({ email })
	})


	const db = await mongoose.connect('mongodb://admin:pass@localhost:27017', {
		dbName: '03-Nejc-Rogelsek'
	}).then(conn => {
		fastify.decorate('store', {
			User: conn.model('User', User),
			Event: conn.model('Event', Event),
			Reservation: conn.model('Reservation', Reservation),
			db: conn
		})
		console.log('Database connected!')
		return conn
	}).catch(console.error)

	if (!db) throw new Error('Cannot connect to database.')
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
	export interface FastifyInstance {
		generateJwt: (email: string) => string
		store: {
			User: mongoose.Model<IUser>,
			Event: mongoose.Model<IEvent>,
			Reservation: mongoose.Model<IReservation>,
			db: typeof mongoose
		}
	}
}

declare module "fastify-request-context" {
	interface RequestContextData {
		user: IUser
	}
}