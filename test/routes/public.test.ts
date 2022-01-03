import { build } from '../helper'
import { Event } from '../../src/entities/event.entity'
import * as mongoose from 'mongoose'
import { User } from '../../src/entities/user.entity'

describe('PublicTests', () => {
	let app = build()
	let upcoming_event: any

	beforeAll(async () => {
		const UserModel = mongoose.model('User', User)
		const user = new UserModel({
			email: 'john@gmail.com',
			first_name: 'John',
			last_name: 'Doe',
			profile_image: 'undefined',
			created_at: new Date(),
			updated_at: new Date()
		})
		await user.save()

		const EventModel = mongoose.model('Event', Event)
		let new_upcoming_event = new EventModel({
			title: 'Upcoming Event',
			description: 'This is upcoming event.',
			event_image: 'upcoming_event.png',
			location: 'Ljubljana',
			max_visitors: 10,
			date_start: '20.1.2022',
			time_start: '20.00',
			user_id: user._id,
			url: 'Upcoming-Event-1234-5678',
			created_at: new Date(),
			updated_at: new Date()
		})
		new_upcoming_event = await new_upcoming_event.save()
		upcoming_event = new_upcoming_event

		let new_recent_event = new EventModel({
			title: 'Recent Event',
			description: 'This is recent event.',
			event_image: 'recent_event.png',
			location: 'Koper',
			max_visitors: 10,
			date_start: '5.11.2021',
			time_start: '20.00',
			user_id: user._id,
			url: 'Recent-Event-1234-9876',
			created_at: new Date(),
			updated_at: new Date()
		})
		await new_recent_event.save()
	})

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

	test('/public/events/recent (GET)', async () => {
		const res = await app.inject({
			url: '/public/events/recent',
			method: 'GET'
		})
		expect(res.statusCode === 200)
		expect(200)
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

	test('/public/events/:id (GET)', async () => {
		const res = await app.inject({
			url: `/public/events/${JSON.stringify(upcoming_event._id).split('"')[1]}`,
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
			created_at: expect.any(String),
			updated_at: expect.any(String)
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
			url: `/public/events/url/${upcoming_event.url}`,
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
			created_at: expect.any(String),
			updated_at: expect.any(String)
		})
	})

	test('/public/events/search (POST)', async () => {
		const res = await app.inject({
			url: '/public/events/search',
			method: 'POST',
			payload: {
				search_term: 'lj'
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
