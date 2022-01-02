import { FastifyPluginAsync } from "fastify"
import { UpdateOpts, UpdateBody, DeleteEventOpts, GetOneOpts, GetOpts } from './types'
import { Event } from "../../entities/event.entity"
import { deleteUser } from 'firebase/auth'

const users: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.get('/', GetOpts, async (request, reply) => {
		request.log.info('Searching for users.')
		const users = await fastify.store.User.find()
		if (!users) {
			fastify.log.error('/users -> GET: Cannot find any users.')
			return reply.getHttpError(404, 'Cannot find any users.')
		}
		return reply.status(200).send(users)
	})

	fastify.get('/:id', GetOneOpts, async (request, reply) => {
		request.log.info('Get specific user.')
		const params = JSON.parse(JSON.stringify(request.params))
		const user = await fastify.store.User.findOne({ _id: params.id }).populate('events', Event) // 618befee0658295b7ef2f407
		if (!user) {
			fastify.log.error('/users/:id -> GET: Cannot find any users.')
			return reply.getHttpError(404, 'Cannot find any users.')
		}
		return reply.status(200).send({ ...user.toObject() })
	})

	fastify.patch<{ Body: UpdateBody }>('/:id', UpdateOpts, async (request, reply) => {
		request.log.info('Updating user.')
		const params = JSON.parse(JSON.stringify(request.params))
		const user = await fastify.store.User.findOne({ _id: params.id })
		if (!user) {
			fastify.log.error('/users/:id -> PATCH: Cannot find any users.')
			return reply.getHttpError(404, 'Cannot find any users.')
		}
		if (request.body.first_name) user.first_name = request.body.first_name
		if (request.body.last_name) user.last_name = request.body.last_name
		user.updated_at = new Date()

		const savedUser = await user.save()

		if (!savedUser) {
			fastify.log.error('/users/:id -> PATCH: Cannot update new user.')
			return reply.getHttpError('404', 'Cannot update new user.')
		}
		return reply.status(201).send({ ...savedUser.toObject() })
	})

	fastify.delete('/:id', DeleteEventOpts, async (request, reply) => {
		request.log.info('Deleting user.')
		const params = JSON.parse(JSON.stringify(request.params))
		const user = await fastify.store.User.findOne({ _id: params.id })
		if (!user) {
			fastify.log.error('/users/:id -> DELETE: Cannot find any users.')
			return reply.getHttpError(404, 'Cannot find any users.')
		}
		await deleteUser(params.id)
		const deletedUser = await user.remove()
		if (!deletedUser) {
			fastify.log.error('/users/:id -> DELETE: Cannot delete user.')
			return reply.getHttpError(404, 'Cannot delete user.')
		}
		return reply.status(200).send({ ...deletedUser.toObject() })
	})
}

export default users;
