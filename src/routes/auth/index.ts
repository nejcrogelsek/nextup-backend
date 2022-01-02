import { FastifyPluginAsync } from "fastify"
import { RegisterOpts, RegisterBody, LoginOpts, LoginBody } from './types'
import * as sgMail from '@sendgrid/mail'
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth'
import { auth as firebaseAuth } from '../../config/firebase'

sgMail.setApiKey('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')

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.post<{ Body: RegisterBody }>('/register', RegisterOpts, async (request, reply) => {
		request.log.info('Creating a new user.')
		const { password, email } = request.body
		const result = await createUserWithEmailAndPassword(firebaseAuth, email, password)
		if (result.user) {
			const user = new fastify.store.User({
				uid: result.user.uid,
				email: request.body.email,
				first_name: request.body.first_name,
				last_name: request.body.last_name,
				profile_image: request.body.profile_image,
				created_at: new Date(),
				updated_at: new Date()
			})

			const newUser = await user.save()
			if (!newUser) {
				fastify.log.error('/auth/register -> POST: Cannot create new user to MongoDB.')
				return reply.getHttpError('404', 'Cannot create new user to MongoDB.')
			}
			await sendEmailVerification(result.user)
			return reply.status(201).send({
				user: {
					email: result.user.email,
					profile_image: request.body.profile_image,
					first_name: request.body.first_name,
					last_name: request.body.last_name
				}
			})
		} else {
			fastify.log.error('/auth/register -> POST: Invalid credentials.')
			return reply.getHttpError('404', 'Invalid credentials.')
		}
	})

	fastify.post<{ Body: LoginBody }>('/login', LoginOpts, async (request, reply) => {
		request.log.info('Logging user in application.')
		const { email, password } = request.body
		const result = await signInWithEmailAndPassword(firebaseAuth, email, password)
		if (result.user) {
			const user = await fastify.store.User.findOne({ email })
			if (!user) {
				fastify.log.error(`/auth/login -> POST: User with email ${email} does not exist.`)
				return reply.getHttpError(404, `User with email ${email} does not exist.`)
			}
			if (result.user.emailVerified === false) {
				fastify.log.error('/auth/login -> POST: Please confirm your email address.')
				return reply.getHttpError(404, 'Please confirm your email address.')
			}
			const token = fastify.generateJwt(user.email, user._id)
			return reply.status(200).send({
				token,
				user: {
					email: user.email,
					first_name: user.first_name,
					last_name: user.last_name,
					profile_image: user.profile_image
				}
			})
		} else {
			fastify.log.error('/auth/login -> POST: Invalid credentials.')
			return reply.getHttpError(404, 'Invalid credentials.')
		}
	})
}

export default auth;
