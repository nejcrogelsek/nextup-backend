import { build } from '../helper'

describe('UsersTests', () => {
	let app = build()

	test('/users (GET)', async () => {
		const res = await app.inject({
			url: '/users',
			method: 'GET'
		})
		expect(res.statusCode === 200)
		expect(200)
	})

	test('/users/:id (GET)', async () => {
		const res = await app.inject({
			url: '/users/618d1c266c2cd45459c4ab5a',
			method: 'GET'
		})
		expect(res.statusCode === 200)
		expect(JSON.parse(res.payload)).toEqual({
			_id: expect.any(String),
			profile_image: expect.any(String),
			first_name: expect.any(String),
			last_name: expect.any(String),
			email: expect.any(String),
			email_token: null,
			confirmed: expect.any(Boolean),
			password: expect.any(String),
			events: [],
			created_at: expect.any(String),
			updated_at: expect.any(String),
			__v: 0
		})
	})

	test('/users/:id (PATCH)', async () => {
		const res = await app.inject({
			url: '/users/61a8cde194f632666d0f37b2',
			method: 'PATCH',
			payload: {
				email: "nejcrogelsek80@gmail.com",
				profile_image: "undefined",
				first_name: "KR en",
				last_name: "junior"
			}
		})
		expect(res.statusCode === 200)
		expect(JSON.parse(res.payload)).toEqual({
			_id: expect.any(String),
			profile_image: expect.any(String),
			first_name: expect.any(String),
			last_name: expect.any(String),
			email: expect.any(String),
			email_token: expect.any(String) || null || "",
			confirmed: expect.any(Boolean),
			password: expect.any(String),
			created_at: expect.any(String),
			updated_at: expect.any(String)
		})
	})

	test('/users/:id (DELETE)', async () => {
		const res = await app.inject({
			url: '/users/61a8cde194f632666d0f37b2',
			method: 'DELETE'
		})
		expect(res.statusCode === 200)
		expect(JSON.parse(res.payload)).toEqual({
			_id: expect.any(String),
			profile_image: expect.any(String),
			first_name: expect.any(String),
			last_name: expect.any(String),
			email: expect.any(String),
			email_token: expect.any(String) || null || "",
			confirmed: expect.any(Boolean),
			password: expect.any(String),
			created_at: expect.any(String),
			updated_at: expect.any(String)
		})
	})

})
