import { FastifyPluginAsync } from "fastify"
import { IEvent } from "../../interfaces/event.interface"
import { GetOneOpts, GetOpts, GetUrlOpts, UploadOpts } from "./types"

const shared: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.get('/events', GetOpts, async (request, reply) => {
		request.log.info('Searching for events.')
		const events = await fastify.store.Event.find()
		if (!events) {
			fastify.log.error('/public/events -> GET: Cannot find any events.')
			return reply.getHttpError(404, 'Cannot find any events.')
		}
		return reply.status(200).send(events)
	})

	fastify.get('/events/upcoming', GetOpts, async (request, reply) => {
		request.log.info('Searching for upcoming events.')
		const events = await fastify.store.Event.find()
		if (!events) {
			fastify.log.error('/public/events/upcoming -> GET: Cannot find any events.')
			return reply.getHttpError(404, 'Cannot find any events.')
		}

		let upcomingEvents: IEvent[] = []
		let tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		for (let i = 0; i < events.length; i++) {
			const d = new Date(events[i].date_start.split('.').reverse().join('-')).getTime()
			if (d >= tomorrow.getTime()) {
				upcomingEvents.push(events[i])
			}
		}
		upcomingEvents.reverse()
		return reply.status(200).send(upcomingEvents)
	})

	fastify.get('/events/recent', GetOpts, async (request, reply) => {
		request.log.info('Searching for recent events.')
		const events = await fastify.store.Event.find()
		if (!events) {
			fastify.log.error('/public/events/recent -> GET: Cannot find any events.')
			return reply.getHttpError(404, 'Cannot find any events.')
		}

		let recentEvents: IEvent[] = []
		let tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		for (let i = 0; i < events.length; i++) {
			const d = new Date(events[i].date_start.split('.').reverse().join('-')).getTime()
			if (d <= tomorrow.getTime()) {
				recentEvents.push(events[i])
			}
		}
		recentEvents.reverse()
		return reply.status(200).send(recentEvents)
	})

	fastify.post('/events/search', GetOpts, async (request, reply) => {
		request.log.info('Search functionality: searching for requested events.')
		const body = JSON.parse(JSON.stringify(request.body))
		const events = await fastify.store.Event.find()
		if (!events) {
			return reply.status(200).send([])
		}
		let searchResults: IEvent[] = []
		for (let i = 0; i < events.length; i++) {
			if (body.search_term && events[i].location.toLowerCase().replaceAll(' ', '').includes(body.search_term.toLowerCase().replaceAll(' ', '')) || events[i].date_start === body.date_term) {
				searchResults.push(events[i])
			}
		}
		searchResults.reverse()
		return reply.status(200).send(searchResults)
	})

	fastify.get('/events/:id', GetOneOpts, async (request, reply) => {
		request.log.info('Get specific event.')
		const params = JSON.parse(JSON.stringify(request.params))
		const event = await fastify.store.Event.findOne({ _id: params.id })
		if (!event) {
			fastify.log.error('/public/events/:id -> GET: Cannot find any events.')
			return reply.getHttpError(404, 'Cannot find any events.')
		}
		return reply.status(200).send({ ...event.toObject() })
	})

	fastify.get('/events/url/:url', GetUrlOpts, async (request, reply) => {
		const params = JSON.parse(JSON.stringify(request.params))
		const event = await fastify.store.Event.findOne({ url: `${params.url}` })
		if (!event) {
			fastify.log.error('/public/events/url/:url -> GET: Cannot find any events.')
			return reply.getHttpError(404, 'Cannot find any events.')
		}
		return reply.status(200).send({ ...event.toObject() })
	})

	fastify.get('/upload', UploadOpts, async (request, reply) => {
		request.log.info('Uploading a user profile picture.')
		const { url } = await fastify.generateUploadUrl()
		if (!url) {
			fastify.log.error('/public/upload -> GET: No data received.')
			return reply.getHttpError(404, 'No data received.')
		}
		return reply.status(200).send({ url: url })
	})
}

export default shared;
