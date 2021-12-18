import { FastifyPluginAsync } from "fastify"
import { RefreshTokenBody, ProtectedRouteOpts, RefreshTokenOpts } from "./types"

const events: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.addHook('onRequest', async (request, reply) => {
		try {
			await request.jwtVerify()
		} catch (error) {
			return reply.send({ error })
		}
	})

	fastify.post<{ Body: RefreshTokenBody }>('/refresh-token', RefreshTokenOpts, async (request, reply) => {
		request.log.info('Request refresh token')
		const access_token = fastify.jwt.sign(request.body)
		return reply.status(201).send({
			access_token
		})

	})

	fastify.get('/protected', ProtectedRouteOpts, async (request, reply) => {
		request.log.info('Request user data.')
		const requested_user = JSON.parse(JSON.stringify(request.user))
		const user = await fastify.store.User.findOne({ _id: requested_user.id })
		if (!user) {
			fastify.log.error('/private/protected -> GET: No users found.')
			return reply.getHttpError('404', 'No users found.')
		}
		return reply.status(200).send({ _id: user._id, first_name: user.first_name, last_name: user.last_name, profile_image: user.profile_image, confirmed: user.confirmed, email: user.email })
	})
}

export default events;
