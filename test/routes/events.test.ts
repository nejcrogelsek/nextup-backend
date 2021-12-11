import { build } from '../helper'
import { hashSync } from 'bcrypt'
import { User } from '../../src/entities/user.entity'
import * as mongoose from 'mongoose'

describe('EventsTests', () => {
	let app = build()
	let token: string
	let event: any
	let user: any

	beforeAll(async () => {
		const UserModel = mongoose.model('User', User)
		let initialUser = new UserModel({
			email: 'john@gmail.com',
			first_name: 'John',
			last_name: 'Doe',
			profile_image: 'undefined',
			password: hashSync('New123!', 10),
			confirmed: true,
			email_token: null,
			created_at: new Date(),
			updated_at: new Date()
		})
		initialUser = await initialUser.save()
		user = initialUser
	})

	test('/auth/login (POST)', async () => {
		const res = await app.inject({
			url: '/auth/login',
			method: 'POST',
			payload: {
				email: user.email,
				password: 'New123!'
			}
		})
		expect(res.statusCode === 201)
		expect(JSON.parse(res.payload)).toEqual({
			token: expect.any(String),
			user: {
				email: 'john@gmail.com',
				profile_image: 'undefined',
				first_name: 'John',
				last_name: 'Doe'
			}
		})
		token = JSON.parse(res.payload).token
	})

	test('/events (POST)', async () => {
		const res = await app.inject({
			url: '/events',
			method: 'POST',
			headers: {
				'authorization': `Bearer ${token}`
			},
			payload: {
				title: 'My Event',
				location: 'Home TV',
				event_image: '/event5.png',
				max_visitors: 66,
				date_start: '6.12.2021',
				time_start: '16.00',
				description: 'This is my event description.'
			}
		})
		expect(res.statusCode === 201)
		expect(JSON.parse(res.payload)).toEqual({
			_id: expect.any(String),
			title: 'My Event',
			location: 'Home TV',
			event_image: '/event5.png',
			max_visitors: 66,
			date_start: '6.12.2021',
			time_start: '16.00',
			description: 'This is my event description.',
			user_id: JSON.parse(res.payload).user_id,
			url: expect.any(String),
			created_at: expect.any(String),
			updated_at: expect.any(String)
		})
		event = JSON.parse(res.payload)
	})

	test('/events/book (POST)', async () => {
		const res = await app.inject({
			url: '/events/book',
			method: 'POST',
			headers: {
				'authorization': `Bearer ${token}`
			},
			payload: {
				event_id: event._id,
			}
		})
		expect(res.statusCode === 201)
		expect(JSON.parse(res.payload)).toEqual({
			_id: expect.any(String),
			user_id: expect.any(String),
			event_id: expect.any(String),
			created_at: expect.any(String)
		})
	})

	test('/events (GET)', async () => {
		const res = await app.inject({
			url: '/events',
			method: 'GET',
			headers: {
				'authorization': `Bearer ${token}`
			}
		})
		expect(res.statusCode === 200)
		expect(200)
		expect(JSON.parse(res.payload)).toEqual([{
			_id: expect.any(String),
			title: 'My Event',
			location: 'Home TV',
			event_image: '/event5.png',
			max_visitors: 66,
			date_start: '6.12.2021',
			time_start: '16.00',
			description: 'This is my event description.',
			user_id: expect.any(String),
			url: expect.any(String),
			created_at: expect.any(String),
			updated_at: expect.any(String),
			__v: 0
		}])
	})

	test('/events/added-events (GET)', async () => {
		const res = await app.inject({
			url: '/events/added-events',
			method: 'GET',
			headers: {
				'authorization': `Bearer ${token}`
			}
		})
		expect(res.statusCode === 200)
		expect(200)
		expect(JSON.parse(res.payload)).toEqual([{
			_id: expect.any(String),
			title: 'My Event',
			location: 'Home TV',
			event_image: '/event5.png',
			max_visitors: 66,
			date_start: '6.12.2021',
			time_start: '16.00',
			description: 'This is my event description.',
			user_id: expect.any(String),
			url: expect.any(String),
			created_at: expect.any(String),
			updated_at: expect.any(String),
			__v: 0
		}])
	})

	test('/events/reservations/:id (GET)', async () => {
		const res = await app.inject({
			url: `/events/reservations/${event._id}`,
			method: 'GET',
			headers: {
				'authorization': `Bearer ${token}`
			}
		})
		expect(res.statusCode === 200)
		expect(200)
		expect(JSON.parse(res.payload)).toEqual({
			allowed: expect.any(Boolean)
		})
	})

	test('/events/reservations (GET)', async () => {
		const res = await app.inject({
			url: '/events/reservations',
			method: 'GET',
			headers: {
				'authorization': `Bearer ${token}`
			}
		})
		expect(res.statusCode === 200)
		expect(200)
		expect(JSON.parse(res.payload)).toEqual([{
			_id: expect.any(String),
			user_id: expect.any(String),
			event_id: expect.any(String),
			created_at: expect.any(String),
			__v: 0
		}])
	})

	test('/events/:id/visitors (GET)', async () => {
		const res = await app.inject({
			url: `/events/${event._id}/visitors`,
			method: 'GET',
			headers: {
				'authorization': `Bearer ${token}`
			}
		})
		expect(res.statusCode === 200)
		expect(200)
	})

	test('/events (PATCH)', async () => {
		const res = await app.inject({
			url: '/events',
			method: 'PATCH',
			headers: {
				'authorization': `Bearer ${token}`
			},
			payload: {
				_id: event._id,
				title: 'title change',
				location: 'Spremenjana lokacija',
				event_image: '/event5.png',
				max_visitors: 90,
				date_start: '20.12.2021',
				time_start: '10.00',
				description: 'description changed',
				user_id: user._id
			}
		})
		expect(res.statusCode === 200)
		console.log(JSON.parse(res.payload))
		expect(JSON.parse(res.payload)).toEqual({
			_id: event._id,
			title: 'title change',
			location: 'Spremenjana lokacija',
			event_image: '/event5.png',
			max_visitors: 90,
			date_start: '20.12.2021',
			time_start: '10.00',
			description: 'description changed',
			user_id: user._id,
			url: expect.any(String),
			created_at: expect.any(String),
			updated_at: expect.any(String)
		})
	})

	test('/events/reservations/:id (DELETE)', async () => {
		const res = await app.inject({
			url: `/events/reservations/${event._id}`,
			method: 'DELETE',
			headers: {
				'authorization': `Bearer ${token}`
			}
		})
		expect(res.statusCode === 200)
		expect(JSON.parse(res.payload)).toEqual({
			_id: expect.any(String),
			user_id: expect.any(String),
			event_id: expect.any(String),
			created_at: expect.any(String),
			__v: 0
		})
	})

	test('/events/:id (DELETE)', async () => {
		const res = await app.inject({
			url: `/events/${event._id}`,
			method: 'DELETE',
			headers: {
				'authorization': `Bearer ${token}`
			}
		})
		expect(res.statusCode === 200)
		expect(JSON.parse(res.payload)).toEqual({
			_id: expect.any(String),
			title: 'My Event',
			location: 'Home TV',
			event_image: '/event5.png',
			max_visitors: 66,
			date_start: '6.12.2021',
			time_start: '16.00',
			description: 'This is my event description.',
			user_id: JSON.parse(res.payload).user_id,
			url: expect.any(String),
			created_at: expect.any(String),
			updated_at: expect.any(String)
		})
	})

})
