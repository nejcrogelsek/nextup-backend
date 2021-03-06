import { build } from '../helper'
import { User } from '../../src/entities/user.entity'
import * as mongoose from 'mongoose'

describe('PrivateTests', () => {
	let app = build()
	let token: string
	let user: any

	beforeAll(async () => {
		const UserModel = mongoose.model('User', User)
		let initialUser = new UserModel({
			email: 'john@gmail.com',
			first_name: 'John',
			last_name: 'Doe',
			profile_image: 'undefined',
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

	test('/private/refresh-token (POST)', async () => {
		const res = await app.inject({
			url: '/private/refresh-token',
			method: 'POST',
			headers: {
				'authorization': `Bearer ${token}`
			},
			payload: {
				id: user._id,
				email: user.email,
			}
		})
		expect(res.statusCode === 201)
		expect(JSON.parse(res.payload)).toEqual({ access_token: expect.any(String) })
	})

	test('/private/protected (GET)', async () => {
		const res = await app.inject({
			url: `/private/protected`,
			method: 'GET',
			headers: {
				'authorization': `Bearer ${token}`
			}
		})
		expect(res.statusCode === 200)
		expect(JSON.parse(res.payload)).toEqual({
			_id: expect.any(String),
			uid: expect.any(String),
			email: 'john@gmail.com',
			first_name: 'John',
			last_name: 'Doe',
			profile_image: 'undefined'
		})
	})

})
