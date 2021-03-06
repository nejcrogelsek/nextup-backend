import { Type, Static } from '@sinclair/typebox'
import { RouteShorthandOptions } from 'fastify'

const AddRequest = Type.Object({
	title: Type.String(),
	location: Type.String(),
	event_image: Type.String(),
	max_visitors: Type.Number({ minimum: 1, description: 'Invalid credentials.' }),
	date_start: Type.String(),
	time_start: Type.RegEx(/^([0-1]?[0-9]|2[0-3]).[0-5][0-9]$/, { description: 'Invalid credentials.' }),
	description: Type.String()
})

const AddResponse = Type.Object({
	_id: Type.String(),
	title: Type.String(),
	description: Type.String(),
	location: Type.String(),
	event_image: Type.String(),
	max_visitors: Type.Number(),
	user_id: Type.String(),
	date_start: Type.String(),
	time_start: Type.String(),
	url: Type.String(),
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
	_id: Type.String(),
	title: Type.String(),
	location: Type.String(),
	event_image: Type.Optional(Type.String()),
	max_visitors: Type.Number({ minimum: 1, description: 'Invalid credentials.' }),
	date_start: Type.String(),
	time_start: Type.RegEx(/^([0-1]?[0-9]|2[0-3]).[0-5][0-9]$/, { description: 'Invalid credentials.' }),
	description: Type.String(),
	user_id: Type.String()
})

const UpdateResponse = Type.Object({
	acknowledged: Type.Boolean(),
	modifiedCount: Type.Number(),
	upsertedId: Type.Null(),
	upsertedCount: Type.Number(),
	matchedCount: Type.Number()
})

export const UpdateOpts: RouteShorthandOptions = {
	schema: {
		body: UpdateRequest,
		response: {
			201: UpdateResponse
		}
	}
}

export type UpdateBody = Static<typeof UpdateRequest>

const BookEventRequest = Type.Object({
	event_id: Type.String()
})

const BookEventResponse = Type.Object({
	_id: Type.String(),
	user_id: Type.String(),
	event_id: Type.String(),
	created_at: Type.String({ format: 'date-time' })
})

export const BookEventOpts: RouteShorthandOptions = {
	schema: {
		body: BookEventRequest,
		response: {
			201: BookEventResponse
		}
	}
}

export type BookEventBody = Static<typeof BookEventRequest>

export const DeleteEventOpts: RouteShorthandOptions = {
	schema: {
		params: {
			id: { type: 'string' }
		},
		response: {
			200: AddResponse
		}
	}
}

export const DeleteReservationOpts: RouteShorthandOptions = {
	schema: {
		params: {
			id: { type: 'string' }
		},
		response: {
			200: {
				_id: Type.String(),
				user_id: Type.String(),
				event_id: Type.String(),
				created_at: Type.String({ format: 'date-time' })
			}
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
			200: {
				allowed: Type.Boolean()
			}
		}
	}
}