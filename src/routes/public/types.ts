import { Type } from '@sinclair/typebox'
import { RouteShorthandOptions } from 'fastify'

export const UploadOpts: RouteShorthandOptions = {
	schema: {
		response: {
			200: { url: { type: 'string' } }
		}
	}
}

const GetResponse = Type.Object({
	_id: Type.String(),
	title: Type.String(),
	desciption: Type.String(),
	location: Type.String(),
	event_image: Type.String(),
	max_visitors: Type.Number({ minimum: 1 }),
	user_id: Type.String(),
	date_start: Type.String({ format: 'date-time' }),
	time_start: Type.RegEx(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
	created_at: Type.String({ format: 'date-time' }),
	updated_at: Type.String({ format: 'date-time' }),
})

export const GetOpts: RouteShorthandOptions = {
	schema: {
		response: {
			200: GetResponse
		}
	}
}

export const GetOneOpts: RouteShorthandOptions = {
	schema: {
		params: {
			id: { type: 'string' }
		},
		response: {
			200: GetResponse
		}
	}
}