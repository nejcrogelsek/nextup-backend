import { FastifyError, FastifyInstance, FastifyPluginOptions } from 'fastify'
import fp from 'fastify-plugin'

export default fp(async (
	fastify: FastifyInstance,
	opts: FastifyPluginOptions,
	next: (error?: FastifyError) => void
) => {
	fastify.register(require('fastify-swagger'), {
		routePrefix: '/documentation',
		swagger: {
			info: {
				title: 'Nextup Documentation',
				description: 'Testing the Fastify Nextup APIs.',
				version: '0.1.0'
			},
			externalDocs: {
				url: 'https://swagger.io',
				description: 'Find more info here'
			},
			host: 'localhost:3000',
			schemes: ['http'],
			consumes: ['application/json'],
			produces: ['application/json'],
			definitions: {
				User: {
					type: 'object',
					required: ['_id', 'profile_image', 'first_name', 'last_name', 'email', 'email_token', 'confirmed', 'password', 'created_at', 'updated_at'],
					properties: {
						_id: { type: 'string' },
						profile_image: { type: 'string' },
						first_name: { type: 'string' },
						last_name: { type: 'string' },
						email: { type: 'string', format: 'email' },
						email_token: { type: 'string' },
						confirmed: { type: 'boolean' },
						password: { type: 'string' },
						events: { type: 'ref' },
						created_at: { type: 'date' },
						updated_at: { type: 'date' }
					}
				},
				Event: {
					type: 'object',
					required: ['_id', 'title', 'description', 'event_image', 'location', 'max_visitors', 'date_start', 'time_start', 'user_id', 'url', 'created_at', 'updated_at'],
					properties: {
						_id: { type: 'string' },
						title: { type: 'string' },
						description: { type: 'string' },
						event_image: { type: 'string' },
						location: { type: 'string' },
						max_visitors: { type: 'number' },
						date_start: { type: 'string' },
						time_start: { type: 'string' },
						user_id: { type: 'ref' },
						url: { type: 'string' },
						created_at: { type: 'date' },
						updated_at: { type: 'date' }
					}
				},
				Reservation: {
					type: 'object',
					required: ['_id', 'user_id', 'event_id', 'created_at'],
					properties: {
						_id: { type: 'string' },
						user_id: { type: 'string' },
						event_id: { type: 'string' },
						created_at: { type: 'date' }
					}
				},
				RegisterRequest: {
					type: 'object',
					required: ['profile_image', 'first_name', 'last_name', 'email', 'password'],
					properties: {
						email: { type: 'string', format: 'email' },
						profile_image: { type: 'string' },
						first_name: { type: 'string' },
						last_name: { type: 'string' },
						password: { type: 'string' }
					}
				},
				LoginRequest: {
					type: 'object',
					required: ['password', 'email'],
					properties: {
						email: { type: 'string', format: 'email' },
						password: { type: 'string' }
					}
				},
				RefreshTokenRequest: {
					type: 'object',
					required: ['id', 'email'],
					properties: {
						email: { type: 'string', format: 'email' },
						id: { type: 'string' }
					}
				},
				UserUpdateRequest: {
					type: 'object',
					required: ['first_name', 'last_name', 'email', 'password'],
					properties: {
						email: { type: 'string', format: 'email' },
						first_name: { type: 'string' },
						last_name: { type: 'string' },
						password: { type: 'string' }
					}
				},
				EventAddRequest: {
					type: 'object',
					required: ['title', 'description', 'event_image', 'location', 'max_visitors', 'date_start', 'time_start'],
					properties: {
						title: { type: 'string' },
						description: { type: 'string' },
						event_image: { type: 'string' },
						location: { type: 'string' },
						max_visitors: { type: 'number' },
						date_start: { type: 'string' },
						time_start: { type: 'string' }
					}
				},
				EventUpdateRequest: {
					type: 'object',
					required: ['_id', 'title', 'description', 'event_image', 'location', 'max_visitors', 'date_start', 'time_start', 'user_id'],
					properties: {
						_id: { type: 'string' },
						title: { type: 'string' },
						description: { type: 'string' },
						event_image: { type: 'string' },
						location: { type: 'string' },
						max_visitors: { type: 'number' },
						date_start: { type: 'string' },
						time_start: { type: 'string' },
						user_id: { type: 'string' }
					}
				},
				BookEventRequest: {
					type: 'object',
					required: ['event_id'],
					properties: {
						event_id: { type: 'string' }
					}
				},
				UrlRequest: {
					type: 'object',
					required: ['url'],
					properties: {
						url: { type: 'string' }
					}
				},
			}
		},
		exposeRoute: true
	})
	next()
})