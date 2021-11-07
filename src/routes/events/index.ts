import { FastifyPluginAsync } from "fastify"
import { AddBody, AddOpts, UpdateBody, UpdateOpts } from './types'

const events: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.post<{ Body: AddBody }>('/register', AddOpts, async function (request, reply) {
		const body = request.body
		

		return reply
	})
}

export default events;
