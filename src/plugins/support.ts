import fp from 'fastify-plugin'
import { User } from '../entities/user.entity'
import * as mongoose from 'mongoose'
import { IUser } from '../interfaces/user.interface'
import fastifyJwt from 'fastify-jwt'
import { fastifyRequestContextPlugin } from 'fastify-request-context'

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


	const db = await mongoose.connect('mongodb://root:example@localhost:27017', {
		dbName: 'fastify-crash-course'
	}).then(conn => {
		fastify.decorate('store', {
			User: conn.model('User', User),
			db: conn
		})

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
			db: typeof mongoose
		}
	}
}

declare module "fastify-request-context" {
	interface RequestCOntextData {
		user: IUser
	}
}