import { FastifyPluginAsync } from "fastify"
import { RegisterOpts, RegisterBody, LoginOpts, LoginBody, VerifyEmailOpts } from './types'
import * as bcrypt from 'bcrypt'
import { randomBytes } from "crypto"
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
			const hash = await bcrypt.hash(password, 10)
			const user = new fastify.store.User({
				...request.body,
				password: hash,
				confirmed: result.user.emailVerified,
				email_token: randomBytes(64).toString('hex'),
				created_at: new Date(),
				updated_at: new Date()
			})

			const newUser = await user.save()
			if (!newUser) {
				fastify.log.error('/auth/register -> POST: Cannot register new user.')
				return reply.getHttpError('404', 'Cannot register new user.')
			}
			await sendEmailVerification(result.user)
			return reply.status(201).send({ user: newUser.toObject() })
		} else {
			fastify.log.error('/auth/register -> POST: Cannot register new user.')
			return reply.getHttpError('404', 'Cannot register new user.')
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
			if (user.confirmed === false) {
				fastify.log.error('/auth/login -> POST: Please confirm your email address.')
				return reply.getHttpError(404, 'Please confirm your email address.')
			}
			const isValid = await bcrypt.compare(password, user.password)
			if (!isValid) {
				fastify.log.error('/auth/login -> POST: Invalid credentials.')
				return reply.getHttpError(404, 'Invalid credentials.')
			}
			const token = fastify.generateJwt(email, user._id)
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
			fastify.log.error(`/auth/login -> POST: User with email ${email} does not exist.`)
			return reply.getHttpError(404, `User with email ${email} does not exist.`)
		}
	})

	fastify.get('/verify-email', VerifyEmailOpts, async (request, reply) => {
		request.log.info('Verifing user email address.')
		const query = JSON.parse(JSON.stringify(request.query))
		const user = await fastify.store.User.findOne({
			email_token: query.token
		})
		if (!user) {
			fastify.log.error('/auth/verify-email -> GET: Token is invalid. Please contact us for assistance.')
			return reply.getHttpError(404, 'Token is invalid. Please contact us for assistance.')
		}
		user.email_token = null
		user.confirmed = true

		user.save()
		if (!user) {
			fastify.log.error('/auth/verify-email -> GET: Cannot verify this user.')
			return reply.getHttpError('404', 'Cannot verify this user.')
		}
		return reply.status(302).redirect('http://localhost:3001/login?message="Your email successfully validated. Now you can login."')
	})
}

export default auth;
