import { FastifyPluginAsync } from "fastify"
import { UpdateOpts, UpdateBody, GetOpts, GetOneOpts, DeleteEventOpts } from './types'
import * as bcrypt from 'bcrypt'
import { IUser } from "../../interfaces/user.interface"

const users: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.get('/', GetOpts, async (_, reply) => {
		const events = await fastify.store.Event.find()
		if (!events) {
			return reply.getHttpError(404, 'Cannot find any events.')
		}
		return reply.status(200).send({ ...events })
	})

	fastify.get('/:id', GetOneOpts, async (_, reply) => {
		const event = await fastify.store.Event.findOne({ _id: 'id from query' })
		if (!event) {
			return reply.getHttpError(404, 'Cannot find any events.')
		}
		return reply.status(200).send({ ...event.toObject() })
	})

	fastify.patch<{ Body: UpdateBody }>('/:id', UpdateOpts, async (request, reply) => {
		const { password } = request.body
		const user = await fastify.store.User.findOne({ _id: 'query id' })
		if (!user) {
			return reply.getHttpError(404, 'Cannot find any users.')
		}

		if (password) {
			const hash = await bcrypt.hash(password, 10)
			user.password = hash
		}

		user.first_name = request.body.first_name
		user.last_name = request.body.last_name
		user.updated_at = new Date()

		user.save((err, user) => {
			if (err || !user) {
				return reply.getHttpError('404', 'Cannot Update new user.')
			}
			return reply.status(201).send({ ...user.toObject() })
		})

		return reply
	})

	fastify.delete('/:id', DeleteEventOpts, async (request, reply) => {
		const user = await fastify.store.User.findOne({ _id: 'id from querystring' })
		if (!user) {
			return reply.getHttpError(404, 'Cannot find any users.')
		}
		if (user._id !== 'request user id') {
			return reply.getHttpError(401, 'Unauthorized access')
		}
		user.remove((err: Error, user: IUser) => {
			if (err || !user) {
				return reply.getHttpError(404, 'Cannot delete user.')
			}
			return reply.status(200).send({ ...user })
		})
		return reply
	})
}

export default users;
