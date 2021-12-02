import { FastifyInstance } from 'fastify'
import { build } from '../helper'

describe('RootTests', () => {
	let app: FastifyInstance

	beforeAll(async () => {
		app = await build()
	})

	// Tear down our app after we are done
	afterAll(async () => {
		await app.close()
	})


	test('should return object', async () => {
		const res = await app.inject({
			url: '/'
		})
		expect(JSON.parse(res.payload).toEqual({ root: true }))
	})

})
