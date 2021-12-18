import { Type, Static } from '@sinclair/typebox'
import { RouteShorthandOptions } from 'fastify'

const UpdateRequest = Type.Object({
	email: Type.String({ format: 'email' }),
	first_name: Type.String(),
	last_name: Type.String(),
	password: Type.Optional(Type.RegEx(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/))
})

const UpdateResponse = Type.Object({
	_id: Type.String(),
	email: Type.String({ format: 'email' }),
	profile_image: Type.String(),
	first_name: Type.String(),
	last_name: Type.String(),
	email_token: Type.String(),
	confirmed: Type.Boolean(),
	password: Type.String(),
	created_at: Type.String({ format: 'date-time' }),
	updated_at: Type.String({ format: 'date-time' }),
})

export const UpdateOpts: RouteShorthandOptions = {
	schema: {
		params: {
			id: { type: 'string' }
		},
		body: UpdateRequest,
		response: {
			201: UpdateResponse
		}
	}
}

export type UpdateBody = Static<typeof UpdateRequest>

export const DeleteEventOpts: RouteShorthandOptions = {
	schema: {
		params: {
			id: { type: 'string' }
		},
		response: {
			200: UpdateResponse
		}
	}
}

export const GetOpts: RouteShorthandOptions = {
	schema: {
		response: {
			200: {
				type: 'array'
			}
		}
	}
}

export const GetOneOpts: RouteShorthandOptions = {
	schema: {
		params: {
			id: { type: 'string' }
		},
		response: {
			200: UpdateResponse
		}
	}
}