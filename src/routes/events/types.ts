import { Type, Static } from '@sinclair/typebox'
import { RouteShorthandOptions } from 'fastify'

const AddRequest = Type.Object({
	title: Type.String(),
	desciption: Type.String(),
	location: Type.String(),
	event_image: Type.String(),
	max_visitors: Type.Number({ minimum: 1 }),
	user_id: Type.Number(),
	date_start: Type.String({ format: 'date-time' }),
	time_start: Type.String({ format: 'time' }),
	created_at: Type.String({ format: 'date-time' }),
	updated_at: Type.String({ format: 'date-time' }),
})

const AddResponse = Type.Object({
	_id: Type.String(),
	title: Type.String(),
	desciption: Type.String(),
	location: Type.String(),
	event_image: Type.String(),
	max_visitors: Type.Number({ minimum: 1 }),
	user_id: Type.Number(),
	date_start: Type.String({ format: 'date-time' }),
	time_start: Type.String({ format: 'time' }),
	created_at: Type.String({ format: 'date-time' }),
	updated_at: Type.String({ format: 'date-time' }),
})

export const AddOpts: RouteShorthandOptions = {
	schema: {
		body: AddRequest,
		response: {
			201: AddResponse
		}
	}
}

export type AddBody = Static<typeof AddRequest>

const UpdateRequest = Type.Object({
	title: Type.String(),
	desciption: Type.String(),
	location: Type.String(),
	event_image: Type.Optional(Type.String()),
	max_visitors: Type.Number({ minimum: 1 }),
	user_id: Type.Number(),
	date_start: Type.String({ format: 'date-time' }),
	time_start: Type.String({ format: 'time' }),
})

export const UpdateOpts: RouteShorthandOptions = {
	schema: {
		body: UpdateRequest,
		response: {
			201: AddResponse
		}
	}
}

export type UpdateBody = Static<typeof UpdateRequest>