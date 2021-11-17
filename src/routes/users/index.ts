import { FastifyPluginAsync } from "fastify"
import { UpdateOpts, UpdateBody, DeleteEventOpts } from './types'
import * as bcrypt from 'bcrypt'
import { IUser } from "../../interfaces/user.interface"
import { Event } from "../../entities/event.entity"

const users: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.get('/', async (_, reply) => {
		const users = await fastify.store.User.find()
		if (!users) {
			return reply.getHttpError(404, 'Cannot find any users.')
		}
		return reply.status(200).send(users)
	})

	fastify.get('/:id', async (request, reply) => {
		const params = JSON.parse(JSON.stringify(request.params))
		const user = await fastify.store.User.findOne({ _id: params.id }).populate('events', Event) // 618befee0658295b7ef2f407
		if (!user) {
			return reply.getHttpError(404, 'Cannot find any users.')
		}
		return reply.status(200).send({ ...user.toObject() })
	})

	fastify.patch<{ Body: UpdateBody }>('/:id', UpdateOpts, async (request, reply) => {
		const { password } = request.body
		const params = JSON.parse(JSON.stringify(request.params))
		const user = await fastify.store.User.findOne({ _id: params.id })
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

	fastify.get('/users/upload', async (request, reply) => {
		return reply
	})

	fastify.delete('/:id', DeleteEventOpts, async (request, reply) => {
		const params = JSON.parse(JSON.stringify(request.params))
		const user = await fastify.store.User.findOne({ _id: params.id })
		if (!user) {
			return reply.getHttpError(404, 'Cannot find any users.')
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
