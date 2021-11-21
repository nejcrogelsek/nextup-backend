import { FastifyPluginAsync } from "fastify"
import { IEvent } from "../../interfaces/event.interface"
import { UploadOpts } from "./types"

const shared: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.get('/events', async (request, reply) => {
		request.log.info('Searching for events.')
		const events = await fastify.store.Event.find()
		if (!events) {
			return reply.getHttpError(404, 'Cannot find any events.')
		}
		return reply.status(200).send(events)
	})

	fastify.get('/events/upcoming', async (request, reply) => {
		request.log.info('Searching for upcoming events.')
		const events = await fastify.store.Event.find()
		if (!events) {
			return reply.getHttpError(404, 'Cannot find any events.')
		}

		let upcomingEvents: IEvent[] = []
		let tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		for (let i = 0; i < events.length; i++) {
			const d = new Date(events[i].date_start).getTime()
			if (d >= tomorrow.getTime()) {
				upcomingEvents.push(events[i])
			}
		}
		upcomingEvents.reverse()
		return reply.status(200).send(upcomingEvents)
	})
	
	fastify.get('/events/recent', async (request, reply) => {
		request.log.info('Searching for recent events.')
		const events = await fastify.store.Event.find()
		if (!events) {
			return reply.getHttpError(404, 'Cannot find any events.')
		}

		let recentEvents: IEvent[] = []
		let tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		for (let i = 0; i < events.length; i++) {
			const d = new Date(events[i].date_start).getTime()
			if (d <= tomorrow.getTime()) {
				recentEvents.push(events[i])
			}
		}
		recentEvents.reverse()
		return reply.status(200).send(recentEvents)
	})

	fastify.get('/events/:id', async (request, reply) => {
		request.log.info('Get specific event.')
		const params = JSON.parse(JSON.stringify(request.params))
		const event = await fastify.store.Event.findOne({ _id: params.id })
		if (!event) {
			return reply.getHttpError(404, 'Cannot find any events.')
		}
		return reply.status(200).send({ ...event.toObject() })
	})

	fastify.get('/upload', UploadOpts, async (request, reply) => {
		request.log.info('Uploading a user profile picture.')
		const { url } = await fastify.generateUploadUrl()
		if (!url) {
			return reply.getHttpError(404, 'No data received.')
		}
		return reply.status(200).send({ url: url })
	})
}

export default shared;
