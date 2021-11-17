import { Type, Static } from '@sinclair/typebox'
import { RouteShorthandOptions } from 'fastify'

export const ProtectedRouteOpts: RouteShorthandOptions = {
	schema: {
		response: {
			200: {}
		}
	}
}

const RefreshTokenRequest = Type.Object({
	email: Type.String({ format: 'email' }),
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