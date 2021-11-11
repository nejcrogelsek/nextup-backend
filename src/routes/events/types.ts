import { Type, Static } from '@sinclair/typebox'
import { RouteShorthandOptions } from 'fastify'

const AddRequest = Type.Object({
	title: Type.String(),
	desciption: Type.String(),
	location: Type.String(),
	event_image: Type.String(),
	max_visitors: Type.Number({ minimum: 1 }),
	date_start: Type.String(),
	time_start: Type.String()
})

const AddResponse = Type.Object({
	_id: Type.String(),
	title: Type.String(),
	desciption: Type.String(),
	location: Type.String(),
	event_image: Type.String(),
	max_visitors: Type.Number({ minimum: 1 }),
	user_id: Type.String(),
	date_start: Type.String(),
	time_start: Type.String(),
	created_at: Type.String({ format: 'date' }),
	updated_at: Type.String({ format: 'date' }),
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
	desciption: Type.String(),
	location: Type.String(),
	event_image: Type.Optional(Type.String()),
	max_visitors: Type.Number({ minimum: 1 }),
	user_id: Type.String(),
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

const BookEventRequest = Type.Object({
	user_id: Type.String(),
	event_id: Type.String(),
	created_at: Type.String({ format: 'date-time' })
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

// not wokrking for get
export const GetOpts: RouteShorthandOptions = {
	schema: {
		response: {
			200: AddResponse
		}
	}
}

export const GetOneOpts: RouteShorthandOptions = {
	schema: {
		params: {
			id: { type: 'string' }
		},
		response: {
			200: AddResponse
		}
	}
}