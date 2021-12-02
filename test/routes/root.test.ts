import { build } from '../helper'

describe('RootTests', () => {
	let app = build()

	test('should return object', async () => {
		const res = await app.inject({
			url: '/'
		})
		expect(JSON.parse(res.payload)).toEqual({ root: true })
	})

})
