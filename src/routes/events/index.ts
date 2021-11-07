import { FastifyPluginAsync } from "fastify"
import { Error } from "mongoose"
import { IEventSchema } from "../../interfaces/schema.interface"
import { AddBody, AddOpts, BookEventBody, BookEventOpts, UpdateBody, UpdateOpts } from './types'

const events: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.addHook('onRequest', async (request, reply) => {
		try {
			await request.jwtVerify()
		} catch (error) {
			return reply.send({ error })
		}
	})

	fastify.post<{ Body: AddBody }>('/', AddOpts, async (request, reply) => {
		const { user_id } = request.body
		if ('user request id' !== user_id) {
			return reply.getHttpError(404, 'Unauthorized access')
		}
		const event = new fastify.store.Event({
			...request.body,
			user_id: request.user,
			created_at: new Date(),
			updated_at: new Date(),
		})

		event.save((err, event) => {
			if (err || !event) {
				return reply.getHttpError(404, 'Cannot add new event.')
			}
			return reply.status(201).send({ ...event.toObject() })
		})

		return reply
	})

	fastify.patch<{ Body: UpdateBody }>('/', UpdateOpts, async (request, reply) => {
		const { _id, user_id } = request.body
		const event = await fastify.store.Event.findOne({ _id })
		if (!event) {
			return reply.getHttpError(404, 'Cannot find any events.')
		}
		if ('user request id' !== user_id && 'user request id' !== event.user_id) {
			return reply.getHttpError(404, 'Unauthorized access')
		}

		if (request.body.event_image) {
			event.event_image = request.body.event_image
		}
		event.title = request.body.title
		event.desciption = request.body.desciption
		event.location = request.body.location
		event.max_visitors = request.body.max_visitors
		event.date_start = new Date(request.body.date_start)
		event.time_start = new Date(request.body.time_start)
		event.updated_at = new Date()
		event.update((err: Error, event: IEventSchema) => {
			if (err) {
				return reply.getHttpError(404, 'Cannot update event.')
			}
			return reply.status(201).send({ ...event })
		})

		return reply
	})

	fastify.post<{ Body: BookEventBody }>('/book/:id', BookEventOpts, async (request, reply) => {
		const { user_id, event_id } = request.body
		if ('user request id' !== user_id) {
			return reply.getHttpError(404, 'Unauthorized access')
		}
		const event = await fastify.store.Event.findOne({ _id: event_id })
		if (!event) {
			return reply.getHttpError(404, 'Cannot find any events.')
		}
		const reservation = new fastify.store.Reservation({
			...request.body,
			event_id: event._id,
			user_id: 'user request id',
			created_at: new Date()
		})

		reservation.save((err, reservation) => {
			if (err || !reservation) {
				return reply.getHttpError(404, 'Cannot add new reservation.')
			}

			return reply.status(201).send({ ...reservation.toObject() })
		})

		return reply
	})
}

export default events;
