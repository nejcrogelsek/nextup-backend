import { FastifyPluginAsync } from "fastify"
import { RegisterOpts, RegisterBody, LoginOpts, LoginBody, VerifyEmailOpts } from './types'
import * as bcrypt from 'bcrypt'
import { randomBytes } from "crypto"
import * as sgMail from '@sendgrid/mail'

sgMail.setApiKey('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')

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.post<{ Body: RegisterBody }>('/register', RegisterOpts, async (request, reply) => {
		request.log.info('Creating a new user.')
		const { password } = request.body
		const hash = await bcrypt.hash(password, 10)
		const user = new fastify.store.User({
			...request.body,
			password: hash,
			confirmed: false,
			email_token: randomBytes(64).toString('hex'),
			created_at: new Date(),
			updated_at: new Date()
		})

		const newUser = await user.save()
		if (!newUser) {
			fastify.log.error('/auth/register -> POST: Cannot register new user.')
			return reply.getHttpError('404', 'Cannot register new user.')
		}
		const msg = {
			from: {
				name: 'Nextup',
				email: 'nejcrogelsek0@gmail.com'
			},
			to: request.body.email,
			subject: 'Nextup - verify your email',
			text: `
		   Hello, thanks for registering on our site.
		   Please copy and paste the address below to verify your account.
		   http://localhost:8080/auth/verify-email?token=${user.email_token}
		`,
			html: `
			<h1>Hello</h1>
			<p>Thanks for registering on our site.</p>
			<p>Please click on the link below to verify your account.</p>
			<a href='${request.protocol}://${request.hostname}/auth/verify-email?token=${user.email_token}'>Verify your account</a>
		`
		}
		process.env.NODE_ENV === 'production' ? await sgMail.send(msg) : null
		return reply.status(201).send({ user: newUser.toObject() })
	})

	fastify.post<{ Body: LoginBody }>('/login', LoginOpts, async (request, reply) => {
		request.log.info('Logging user in application.')
		const { email, password } = request.body
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
