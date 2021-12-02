import { build } from '../helper'

describe('PublicTests', () => {
	let app = build()

	test('/public/events (GET)', async () => {
		const res = await app.inject({
			url: '/public/events',
			method: 'GET'
		})
		expect(res.statusCode === 200)
		expect(200)
	})

	test('/public/events/upcoming (GET)', async () => {
		const res = await app.inject({
			url: '/public/events/upcoming',
			method: 'GET'
		})
		expect(res.statusCode === 200)
		expect(200)
	})

	test('/public/events/recent (GET)', async () => {
		const res = await app.inject({
			url: '/public/events/recent',
			method: 'GET'
		})
		expect(res.statusCode === 200)
		expect(200)
	})

	test('/public/events/:id (GET)', async () => {
		const res = await app.inject({
			url: '/public/events/61a3c8948fbd8a5089effa3c',
			method: 'GET'
		})
		expect(res.statusCode === 200)
		expect(JSON.parse(res.payload)).toEqual({
			_id: expect.any(String),
			title: expect.any(String),
			description: expect.any(String),
			event_image: expect.any(String),
			location: expect.any(String),
			max_visitors: expect.any(Number),
			date_start: expect.any(String),
			time_start: expect.any(String),
			user_id: expect.any(String),
			url: expect.any(String),
			created_at: expect.any(String),
			updated_at: expect.any(String),
			__v: 0
		})
	})

	test('/public/upload (GET)', async () => {
		const res = await app.inject({
			url: '/public/upload',
			method: 'GET'
		})
		expect(res.statusCode === 200)
		expect(JSON.parse(res.payload)).toEqual({ url: expect.any(String) })
	})

	test('/public/events/url/:url (GET)', async () => {
		const res = await app.inject({
			url: '/public/events/url/New-event?q=edacb732-efd6-4f47-874e-e48ffb577e1b',
			method: 'GET'
		})
		expect(res.statusCode === 200)
		expect(JSON.parse(res.payload)).toEqual({
			_id: expect.any(String),
			title: expect.any(String),
			description: expect.any(String),
			event_image: expect.any(String),
			location: expect.any(String),
			max_visitors: expect.any(Number),
			date_start: expect.any(String),
			time_start: expect.any(String),
			user_id: expect.any(String),
			url: expect.any(String),
			created_at: expect.any(String),
			updated_at: expect.any(String),
			__v: 0
		})
	})

	test('/public/events/search (POST)', async () => {
		const res = await app.inject({
			url: '/public/events/search',
			method: 'POST',
			payload: {
				search_term: 'Sky'
			}
		})
		expect(res.statusCode === 201)
		expect(JSON.parse(res.payload)).toEqual([{
			_id: expect.any(String),
			title: expect.any(String),
			description: expect.any(String),
			event_image: expect.any(String),
			location: expect.any(String),
			max_visitors: expect.any(Number),
			date_start: expect.any(String),
			time_start: expect.any(String),
			user_id: expect.any(String),
			url: expect.any(String),
			created_at: expect.any(String),
			updated_at: expect.any(String),
			__v: 0
		}])
	})

})
