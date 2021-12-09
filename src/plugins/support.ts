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
import * as schedule from 'node-schedule'
import * as sgMail from '@sendgrid/mail'

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

	if (process.env.NODE_ENV === 'production') {
		schedule.scheduleJob('0 7 * * *', async () => {
			const events = await fastify.store.Event.find()
			const reservations = await fastify.store.Reservation.find()
			if (!events) {
				return null
			}
			let tommorow_events: IEvent[] = []
			for (let i = 0; i < events.length; i++) {
				let newDate = events[i].date_start.replaceAll('.', '-').split('-')
				if (new Date(`${newDate[2]}-${newDate[1]}-${newDate[0]}`).getTime() > new Date(Date.now()).getTime()) {
					tommorow_events.push(events[i])
				}
			}
			let usersIds: string[] = []
			if (reservations) {
				for (let i = 0; i < tommorow_events.length; i++) {
					for (let j = 0; j < reservations.length; j++) {
						if (reservations[j].event_id === tommorow_events[j]._id.toString().split('"')[0]) {
							usersIds.push(reservations[j].user_id)
						}
					}
				}
			}
			const uniq = [...new Set(usersIds)]
			let users: IUser[] = []
			for (let i = 0; i < uniq.length; i++) {
				let findUser = await fastify.store.User.findOne({ _id: uniq[i] })
				if (findUser) {
					users.push(findUser)
				}
			}

			for (let i = 0; i < users.length; i++) {
				const msg = {
					from: {
						name: 'Nextup',
						email: 'nejcrogelsek0@gmail.com'
					},
					to: users[i].email,
					subject: 'Nextup - upcoming event',
					text: `
							Hello ${users[i].first_name} ${users[i].last_name}. Event that you signed for is coming up tomorrow.
							Check the event on the link below.
						`,
					html: `
							<h1>Hello ${users[i].first_name} ${users[i].last_name}.</h1>
							<p>Event that you signed for is coming up tomorrow.</p>
							<p>Check the tommorow events on the link below:</p>
							<a href='http://localhost:3001/search'>Search events/a>
						`
				}
				process.env.NODE_ENV === 'production' ? await sgMail.send(msg) : null
			}
		})
	}
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
	export interface FastifyInstance {
		someSupport: () => { url: string }
		generateJwt: (email: string, id: string) => string
		generateCronJob: (
			date_start: string,
			time_start: string,
			emailTo: string,
			first_name: string,
			last_name: string,
			url: string
		) => string,
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