import { FastifyPluginAsync } from "fastify"
import { ProtectedRouteOpts, RefreshTokenBody } from "./types"

const events: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.addHook('onRequest', async (request, reply) => {
		try {
			await request.jwtVerify()
		} catch (error) {
			return reply.send({ error })
		}
	})

	fastify.post<{ Body: RefreshTokenBody }>('/refresh-token', async (request, reply) => {
		const access_token = fastify.jwt.sign(request.body)
		return reply.status(201).send({
			access_token
		})

	})

	fastify.get('/protected', ProtectedRouteOpts, async (request, reply) => {
		const requested_user = JSON.parse(JSON.stringify(request.user))
		const user = fastify.store.User.findOne({ _id: requested_user.id })
		if (!user) {
			return reply.getHttpError('404', 'No users found.')
		}
		return reply.status(200).send({ ...user })
	})
}

export default events;
