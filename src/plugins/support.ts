import fp from 'fastify-plugin'
import { User } from '../entities/user.entity'
import * as mongoose from 'mongoose'
import { IUser } from '../interfaces/user.interface'
import fastifyJwt from 'fastify-jwt'
import { fastifyRequestContextPlugin } from 'fastify-request-context'
import { Event } from '../entities/event.entity'
import { IEvent, IReservation } from '../interfaces/event.interface'
import { Reservation } from '../entities/reservation.entity'
import { randomBytes } from 'crypto'
import * as AWS from 'aws-sdk'
import fastifyEnv from 'fastify-env'
import fastifyCors from 'fastify-cors'
import * as cron from 'node-cron'

export interface SupportPluginOptions {
	// Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, opts) => {
	fastify.decorate('someSupport', (): string => {
		return 'hugs'
	})

	fastify.register(fastifyEnv, {
		dotenv: true,
		schema: {
			type: 'object',
			properties: {
				AWS_BUCKET_NAME: {
					type: 'string',
					default: ''
				},
				AWS_REGION: {
					type: 'string',
					default: ''
				},
				AWS_ACCESS_KEY_ID: {
					type: 'string',
					default: ''
				},
				AWS_SECRET_ACCESS_KEY: {
					type: 'string',
					default: ''
				},
				AWS_SIGNATURE_VERSION: {
					type: 'string',
					default: ''
				},
				JWT_SECRET: {
					type: 'string',
					default: ''
				},
				MONGODB_URL: {
					type: 'string',
					default: ''
				},
				MONGODB_NAME: {
					type: 'string',
					default: ''
				},
				SENDGRID_API_KEY: {
					type: 'string',
					default: ''
				}
			},
			required: ['AWS_BUCKET_NAME', 'AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_SIGNATURE_VERSION', 'JWT_SECRET', 'MONGODB_URL', 'MONGODB_NAME', 'SENDGRID_API_KEY']
		}
	})

	fastify.register(fastifyCors, {
		logLevel: 'debug',
		origin: '*'
	})

	fastify.register(fastifyRequestContextPlugin)

	fastify.register(fastifyJwt, {
		secret: 'supersecret',
		sign: {
			expiresIn: '15 minutes'
		}
	})

	fastify.decorate('generateJwt', (email: string, id: string) => {
		return fastify.jwt.sign({ email, id })
	})

	fastify.decorate('generateUploadUrl', async (): Promise<{ url: string }> => {
		try {
			const bucketName = process.env.AWS_BUCKET_NAME
			const region = process.env.AWS_REGION
			const accessKeyId = process.env.AWS_ACCESS_KEY_ID
			const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

			const s3 = new AWS.S3({
				region,
				accessKeyId,
				secretAccessKey,
				signatureVersion: 'v4'
			})

			const rawBytes = randomBytes(16)
			const imageName = rawBytes.toString('hex')

			const params = {
				Bucket: bucketName,
				Key: imageName,
				Expires: 60
			}

			const uploadURL = await s3.getSignedUrlPromise('putObject', params)
			if (!uploadURL) {
				throw new Error('No data recevied.')
			}
			return { url: uploadURL }
		} catch (err) {
			console.log(err)
			throw err
		} finally {
			console.log('RUNNING: Plugin generateUploadUrl')
		}
	})

	const db = await mongoose.connect(process.env.MONGODB_URL!.toString(), {
		dbName: process.env.MONGODB_NAME
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

	if (process.env.NODE_ENV !== 'production') {
		cron.schedule('0 14 * * 1', () => { /* send email function */ })
	}
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
	export interface FastifyInstance {
		someSupport: () => { url: string }
		generateJwt: (email: string, id: string) => string
		generateUploadUrl: () => { url: string }
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