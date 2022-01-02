import { Type, Static } from '@sinclair/typebox'
import { RouteShorthandOptions } from 'fastify'

const AccessTokenResponse = Type.Object({
	_id: Type.String(),
	uid: Type.String(),
	email: Type.String({ format: 'email', description: 'Invalid credentials.' }),
	first_name: Type.String(),
	last_name: Type.String(),
	profile_image: Type.String()
})


export const ProtectedRouteOpts: RouteShorthandOptions = {
	schema: {
		response: {
			200: AccessTokenResponse
		}
	}
}

const RefreshTokenRequest = Type.Object({
	email: Type.String({ format: 'email', description: 'Invalid credentials.' }),
	id: Type.String()
})

const RefreshTokenResponse = Type.Object({
	access_token: Type.String()
})

export const RefreshTokenOpts: RouteShorthandOptions = {
	schema: {
		body: RefreshTokenRequest,
		response: {
			201: RefreshTokenResponse
		}
	}
}

export type RefreshTokenBody = Static<typeof RefreshTokenRequest>