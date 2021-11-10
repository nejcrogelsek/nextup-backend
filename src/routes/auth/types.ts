import { Type, Static } from '@sinclair/typebox'
import { RouteShorthandOptions } from 'fastify'

const RegisterRequest = Type.Object({
	email: Type.String({ format: 'email' }),
	profile_image: Type.String(),
	first_name: Type.String(),
	last_name: Type.String(),
	password: Type.String()
})

const RegisterResponse = Type.Object({
	token: Type.String(),
	user: Type.Object({
		email: Type.String({ format: 'email' }),
		profile_image: Type.String(),
		first_name: Type.String(),
		last_name: Type.String()
	}),
})

export const RegisterOpts: RouteShorthandOptions = {
	schema: {
		body: RegisterRequest,
		response: {
			201: RegisterResponse
		}
	}
}

export type RegisterBody = Static<typeof RegisterRequest>

const LoginRequest = Type.Object({
	email: Type.String({ format: 'email' }),
	password: Type.String()
})

export const LoginOpts: RouteShorthandOptions = {
	schema: {
		body: LoginRequest,
		response: {
			200: RegisterResponse
		}
	}
}

export type LoginBody = Static<typeof LoginRequest>

export const VerifyEmailOpts: RouteShorthandOptions = {
	schema: {
		querystring: {
			token: { type: 'string' }
		},
		response: {
			200: {}
		}
	}
}

export const ProtectedRouteOpts: RouteShorthandOptions = {
	schema: {
		response: {
			200: {}
		}
	}
}