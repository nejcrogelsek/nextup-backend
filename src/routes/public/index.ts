import { FastifyPluginAsync } from "fastify"
import { UploadOpts } from "./types"

const shared: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

	fastify.get('/events', async (_, reply) => {
		const events = await fastify.store.Event.find()
		if (!events) {
			return reply.getHttpError(404, 'Cannot find any events.')
		}
		return reply.status(200).send(events)
	})

	fastify.get('/events/:id', async (request, reply) => {
		const params = JSON.parse(JSON.stringify(request.params))
		const event = await fastify.store.Event.findOne({ _id: params.id })
		if (!event) {
			return reply.getHttpError(404, 'Cannot find any events.')
		}
		return reply.status(200).send({ ...event.toObject() })
	})

	fastify.get('/upload', UploadOpts, async (_, reply) => {
		console.log('Uploading a user profile picture.')
		const { url } = await fastify.generateUploadUrl()
		if (!url) {
			return reply.getHttpError(404, 'No data received.')
		}
		return reply.status(200).send({ url: url })
	})

}

export default shared;
