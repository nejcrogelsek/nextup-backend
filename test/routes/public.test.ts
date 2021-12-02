import { build } from '../helper'
import { Event } from '../../src/entities/event.entity'
import * as mongoose from 'mongoose'
import { User } from '../../src/entities/user.entity'
import { randomBytes } from 'crypto'
import { hashSync } from 'bcrypt'

describe('PublicTests', () => {
	let app = build()

	const UserModel = mongoose.model('User', User)
	const user = new UserModel({
		email: 'john@gmail.com',
		first_name: 'John',
		last_name: 'Doe',
		profile_image: 'undefined',
		password: hashSync('New123!', 10),
		confirmed: false,
		email_token: randomBytes(64).toString('hex'),
		created_at: new Date(),
		updated_at: new Date()
	})
	user.save()

	const EventModel = mongoose.model('Event', Event)
	const upcoming_event = new EventModel({
		title: 'Upcoming Event',
		description: 'This is upcoming event.',
		event_image: 'upcoming_event.png',
		location: 'Ljubljana',
		max_visitors: 10,
		date_start: '5.12.2021',
		time_start: '20.00',
		user_id: user._id,
		created_at: new Date(),
		updated_at: new Date()
	})

	upcoming_event.save()
	const recent_event = new EventModel({
		title: 'Recent Event',
		description: 'This is recent event.',
		event_image: 'recent_event.png',
		location: 'Ljubljana',
		max_visitors: 10,
		date_start: '5.11.2021',
		time_start: '20.00',
		user_id: user._id,
		created_at: new Date(),
		updated_at: new Date()
	})
	recent_event.save()

	console.log(user)
	console.log(upcoming_event)
	console.log(recent_event)

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
			url: `/public/events/${JSON.stringify(upcoming_event.url)}`,
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
				search_term: 'upcoming'
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
