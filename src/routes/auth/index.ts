import { FastifyPluginAsync } from "fastify"
import { RegisterOpts, RegisterBody, LoginOpts, LoginBody } from './types'
import * as bcrypt from 'bcrypt'
import { randomBytes } from "crypto"
import * as sgMail from '@sendgrid/mail'

sgMail.setApiKey('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')

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.post<{ Body: RegisterBody }>('/register', RegisterOpts, async (request, reply) => {
		const { password } = request.body
		const hash = await bcrypt.hash(password, 10)
		const user = new fastify.store.User({
			...request.body,
			password: hash,
			email_token: randomBytes(64).toString('hex'),
			created_at: new Date(),
			updated_at: new Date()
		})

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
			<a href='${request.protocol}://${request.hostname}:8080/auth/verify-email?token=${user.email_token}'>Verify your account</a>
		`
		}
		await sgMail.send(msg)

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
