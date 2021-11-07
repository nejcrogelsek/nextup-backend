import { FastifyPluginAsync } from "fastify"
import { RegisterOpts, RegisterBody, LoginOpts, LoginBody } from './types'
import * as bcrypt from 'bcrypt'

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.post<{ Body: RegisterBody }>('/register', RegisterOpts, async (request, reply) => {
		const { password } = request.body
		const hash = await bcrypt.hash(password, 10)
		const user = new fastify.store.User({
			...request.body,
			password: hash,
			created_at: new Date(),
			updated_at: new Date()
		})

		user.save((err, user) => {
			if (err || !user) {
				return reply.getHttpError('404', 'Cannot register new user.')
			}
			const token = fastify.generateJwt(user.email)
			return reply.status(201).send({ ...user.toObject(), token })
		})

		return reply
	})

	fastify.post<{ Body: LoginBody }>('/login', LoginOpts, async (request, reply) => {
		const { email, password } = request.body
		const user = await fastify.store.User.findOne({ email })
		if (!user) {
			return reply.getHttpError(404, `User with email ${email} does not exist.`)
		}

		bcrypt.compare(password, user.password, (err, isValid) => {
			if (err || !isValid) {
				return reply.getHttpError(404, 'Invalid credentials.')
			}
			const token = fastify.generateJwt(email)
			return reply.status(200).send({ token, ...user.toObject() })
		})

		return reply
	})
}

export default auth;
