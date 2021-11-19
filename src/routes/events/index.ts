import { FastifyPluginAsync } from "fastify"
import { AddBody, AddOpts, BookEventBody, BookEventOpts, DeleteEventOpts, UpdateBody, UpdateOpts } from './types'

const events: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.addHook('onRequest', async (request, reply) => {
		try {
			await request.jwtVerify()
		} catch (error) {
			return reply.send({ error })
		}
	})

	fastify.get('/', async (request, reply) => {
		const events = await fastify.store.Event.find()
		if (!events) {
			return reply.getHttpError(404, 'Cannot find any events.')
		}
		return reply.status(200).send(events)
	})

	fastify.get('/added-events', async (request, reply) => {
		const user = JSON.parse(JSON.stringify(request.user))
		const events = await fastify.store.Event.find({ user_id: user.id })
		if (!events) {
			return reply.getHttpError(404, 'Cannot find any events.')
		}
		return reply.status(200).send(events)
	})

	fastify.post<{ Body: AddBody }>('/', AddOpts, async (request, reply) => {
		const requestUser = JSON.parse(JSON.stringify(request.user))
		const user = await fastify.store.User.findOne({ _id: requestUser.id }) // i need to do find with relationship
		if (!user) {
			return reply.getHttpError(404, 'Cannot add event because no users are found')
		}
		const event = new fastify.store.Event({
			...request.body,
			user_id: user._id,
			created_at: new Date(),
			updated_at: new Date(),
		})

		//user.events.push(event.toObject())

		const newEvent = await event.save()
		if (!newEvent) {
			return reply.getHttpError(404, 'Cannot add new event.')
		}
		return reply.status(201).send({ ...event.toObject() })
	})

	fastify.patch<{ Body: UpdateBody }>('/', UpdateOpts, async (request, reply) => {
		const user = JSON.parse(JSON.stringify(request.user))
		const { _id, user_id } = request.body
		const event = await fastify.store.Event.findOne({ _id })
		if (!event) {
			return reply.getHttpError(404, 'Cannot find any events.')
		}
		if (user.id !== user_id && user.id !== event.user_id) {
			return reply.getHttpError(401, 'Unauthorized access')
		}

		if (request.body.event_image) {
			event.event_image = request.body.event_image
		}
		event.title = request.body.title
		event.description = request.body.description
		event.location = request.body.location
		event.max_visitors = request.body.max_visitors
		event.date_start = new Date(request.body.date_start)
		event.time_start = new Date(request.body.time_start)
		event.updated_at = new Date(Date.now())
		const updatedEvent = await event.update()
		if (!updatedEvent) {
			return reply.getHttpError(404, 'Cannot update event.')
		}
		return reply.status(201).send({ ...updatedEvent })
	})

	fastify.delete('/:id', DeleteEventOpts, async (request, reply) => {
		const params = JSON.parse(JSON.stringify(request.params))
		const event = await fastify.store.Event.findOne({ _id: params.id })
		if (!event) {
			return reply.getHttpError(404, 'Cannot find any events.')
		}
		const removedEvent = await event.remove()
		if (!removedEvent) {
			return reply.getHttpError(404, 'Cannot delete event.')
		}
		return reply.status(200).send({ ...removedEvent.toObject() })
	})

	fastify.delete('/reservations/:id', async (request, reply) => {
		const params = JSON.parse(JSON.stringify(request.params))
		const reservation = await fastify.store.Reservation.findOne({ event_id: params.id })
		if (!reservation) {
			return reply.getHttpError(404, 'Cannot find any reservations.')
		}
		const removedReservation = await reservation.remove()
		if (!removedReservation) {
			return reply.getHttpError(404, 'Cannot delete reservation.')
		}
		return reply.status(200).send({ ...removedReservation.toObject() })
	})

	fastify.post<{ Body: BookEventBody }>('/book', BookEventOpts, async (request, reply) => {
		const user = JSON.parse(JSON.stringify(request.user))
		const { event_id, user_id } = request.body
		if (user.id !== user_id) {
			return reply.getHttpError(401, 'Unauthorized access')
		}

		const event = await fastify.store.Event.findOne({ _id: event_id })
		if (!event) {
			return reply.getHttpError(404, 'Cannot find any events.')
		}
		const reservation = new fastify.store.Reservation({
			event_id: event._id,
			user_id: user.id,
			created_at: new Date()
		})

		const newReservation = reservation.save()
		if (!newReservation) {
			return reply.getHttpError(404, 'Cannot add new reservation.')
		}

		return reply.status(201).send({ ...reservation.toObject() })
	})

	fastify.get('/reservations/:id', async (request, reply) => {
		const user = JSON.parse(JSON.stringify(request.user))
		const params = JSON.parse(JSON.stringify(request.params))
		const reservations = await fastify.store.Reservation.findOne({ event_id: params.id, user_id: user.id })
		if (!reservations) {
			return reply.status(200).send({ allowed: true })
		}
		return reply.status(200).send({ allowed: false })
	})

	fastify.get('/reservations', async (request, reply) => {
		const reservations = await fastify.store.Reservation.find()
		if (!reservations) {
			return reply.getHttpError(404, 'Cannot find any reservations.')
		}
		return reply.status(200).send(reservations)
	})
}

export default events;
