import { FastifyPluginAsync } from "fastify"
import { AddBody, AddOpts, BookEventBody, BookEventOpts, DeleteEventOpts, UpdateBody, UpdateOpts } from './types'
import * as sgMail from '@sendgrid/mail'
import { v4 as uuidv4 } from 'uuid'

sgMail.setApiKey('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')

const events: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.addHook('onRequest', async (request, reply) => {
		try {
			await request.jwtVerify()
		} catch (error) {
			return reply.send({ error })
		}
	})

	fastify.get('/', async (request, reply) => {
		request.log.info('Searching for events.')
		const events = await fastify.store.Event.find()
		if (!events) {
			fastify.log.error('/events -> GET: Cannot find any events.')
			return reply.getHttpError(404, 'Cannot find any events.')
		}
		return reply.status(200).send(events)
	})

	fastify.get('/added-events', async (request, reply) => {
		request.log.info('Searching for events that logged in user added.')
		const user = JSON.parse(JSON.stringify(request.user))
		const events = await fastify.store.Event.find({ user_id: user.id })
		if (!events) {
			fastify.log.error('/events/added-events -> GET: Cannot find any events.')
			return reply.getHttpError(404, 'Cannot find any events.')
		}
		return reply.status(200).send(events)
	})

	fastify.post<{ Body: AddBody }>('/', AddOpts, async (request, reply) => {
		request.log.info('Adding new event.')
		const requestUser = JSON.parse(JSON.stringify(request.user))
		const users = await fastify.store.User.find()
		const user = await fastify.store.User.findOne({ _id: requestUser.id })
		if (!user) {
			fastify.log.error('/events -> POST: Cannot add event because no users are found.')
			return reply.getHttpError(404, 'Cannot add event because no users are found')
		}
		let url: string = request.body.title.replaceAll(' ', '-')
		url += `-${uuidv4()}`
		const event = new fastify.store.Event({
			...request.body,
			user_id: user._id,
			url,
			created_at: new Date(),
			updated_at: new Date(),
		})

		const newEvent = await event.save()
		if (!newEvent) {
			fastify.log.error('/events -> POST: Cannot add new event.')
			return reply.getHttpError(404, 'Cannot add new event.')
		}

		let sendTo: string[] = []

		for (let i = 0; i < users.length; i++) {
			sendTo.push(users[i].email)
		}

		const msg = {
			from: {
				name: 'Nextup',
				email: 'nejcrogelsek0@gmail.com'
			},
			to: sendTo,
			subject: 'Nextup - New Event',
			text: `
		   Hello, new event is added.
		`,
			html: `
			<h1>Hello</h1>
			<p>New event is added on our site.</p>
			<p>Click on the link below to checkout new event.</p>
			<a href='http://localhost:3001/event/${newEvent.url}'>Verify your account</a>
		`
		}
		process.env.NODE_ENV === ' production' ? await sgMail.send(msg) : null
		return reply.status(201).send({ ...event.toObject() })
	})

	fastify.patch<{ Body: UpdateBody }>('/', UpdateOpts, async (request, reply) => {
		request.log.info('Updating event.')
		const user = JSON.parse(JSON.stringify(request.user))
		const { _id, user_id } = request.body
		const event = await fastify.store.Event.findOne({ _id })
		if (!event) {
			fastify.log.error('/events -> PATCH: Cannot find any events.')
			return reply.getHttpError(404, 'Cannot find any events.')
		}
		if (user.id !== user_id && user.id !== event.user_id) {
			fastify.log.error('/events -> PATCH: Unauthorized access.')
			return reply.getHttpError(401, 'Unauthorized access')
		}
		let updateBody: any
		if (request.body.event_image) {
			updateBody = {
				$set: {
					title: request.body.title,
					description: request.body.description,
					location: request.body.location,
					max_visitors: request.body.max_visitors,
					date_start: request.body.date_start,
					time_start: request.body.time_start,
					updated_at: new Date(Date.now()),
					event_image: request.body.event_image
				}
			}
		} else {
			updateBody = {
				$set: {
					title: request.body.title,
					description: request.body.description,
					location: request.body.location,
					max_visitors: request.body.max_visitors,
					date_start: request.body.date_start,
					time_start: request.body.time_start,
					updated_at: new Date(Date.now())
				}
			}
		}
		const updatedEvent = await fastify.store.Event.updateOne({ _id: event._id }, updateBody)
		if (!updatedEvent) {
			fastify.log.error('/events -> PATCH: Cannot update event.')
			return reply.getHttpError(404, 'Cannot update event.')
		}
		return reply.status(201).send({ ...updatedEvent })
	})

	fastify.delete('/:id', DeleteEventOpts, async (request, reply) => {
		request.log.info('Deleting event.')
		const params = JSON.parse(JSON.stringify(request.params))
		const event = await fastify.store.Event.findOne({ _id: params.id })
		if (!event) {
			fastify.log.error('/events/:id -> DELETE: Cannot find any users.')
			return reply.getHttpError(404, 'Cannot find any events.')
		}
		const removedEvent = await event.remove()
		if (!removedEvent) {
			fastify.log.error('/events/:id -> DELETE: Cannot delete event.')
			return reply.getHttpError(404, 'Cannot delete event.')
		}
		return reply.status(200).send({ ...removedEvent.toObject() })
	})

	fastify.delete('/reservations/:id', async (request, reply) => {
		request.log.info('Deleting reservation.')
		const params = JSON.parse(JSON.stringify(request.params))
		const reservation = await fastify.store.Reservation.findOne({ event_id: params.id })
		if (!reservation) {
			fastify.log.error('/events/reservations/:id -> DELETE: Cannot find any reservations.')
			return reply.getHttpError(404, 'Cannot find any reservations.')
		}
		const removedReservation = await reservation.remove()
		if (!removedReservation) {
			fastify.log.error('/events/reservations/:id -> DELETE: Cannot delete reservation.')
			return reply.getHttpError(404, 'Cannot delete reservation.')
		}
		return reply.status(200).send({ ...removedReservation.toObject() })
	})

	fastify.post<{ Body: BookEventBody }>('/book', BookEventOpts, async (request, reply) => {
		request.log.info('Adding new reservation.')
		const requestUser = JSON.parse(JSON.stringify(request.user))
		const { event_id } = request.body
		const event = await fastify.store.Event.findOne({ _id: event_id })
		const user = await fastify.store.User.findOne({ _id: requestUser.id })
		if (!event) {
			fastify.log.error('/events/book -> POST: Cannot find any events.')
			return reply.getHttpError(404, 'Cannot find any events.')
		}
		if (!user) {
			fastify.log.error('/events/book -> POST: Unauthorized access')
			return reply.getHttpError(404, 'Unauthorized access')
		}
		const reservation = new fastify.store.Reservation({
			event_id: event._id,
			user_id: user._id,
			created_at: new Date()
		})

		const newReservation = reservation.save()
		if (!newReservation) {
			fastify.log.error('/events/book -> GET: Cannot add new reservation.')
			return reply.getHttpError(404, 'Cannot add new reservation.')
		}

		return reply.status(201).send({ ...reservation.toObject() })
	})

	fastify.get('/reservations/:id', async (request, reply) => {
		request.log.info('Checking if user already booked event.')
		const user = JSON.parse(JSON.stringify(request.user))
		const params = JSON.parse(JSON.stringify(request.params))
		const reservations = await fastify.store.Reservation.findOne({ event_id: params.id, user_id: user.id })
		if (!reservations) {
			return reply.status(200).send({ allowed: true })
		}
		return reply.status(200).send({ allowed: false })
	})

	fastify.get('/reservations', async (request, reply) => {
		request.log.info('Searching for reservations.')
		const reservations = await fastify.store.Reservation.find()
		if (!reservations) {
			fastify.log.error('/events/reservations -> GET: Cannot find any reservations.')
			return reply.getHttpError(404, 'Cannot find any reservations.')
		}
		return reply.status(200).send(reservations)
	})

	fastify.get('/:id/visitors', async (request, reply) => {
		request.log.info('Checking if event is full.')
		const params = JSON.parse(JSON.stringify(request.params))
		const reservations = await fastify.store.Reservation.find({ event_id: params.id })
		const event = await fastify.store.Event.findOne({ _id: params.id })

		if (!event) {
			fastify.log.error('/events/:id/visitors -> GET: Cannot find any events.')
			return reply.getHttpError(404, 'Cannot find any events.')
		}

		if (event.max_visitors === reservations.length) {
			return reply.status(200).send({ allowed: false })
		}

		return reply.status(200).send({ allowed: true })
	})
}

export default events;
