import { build } from '../helper'
import { User } from '../../src/entities/user.entity'
import * as mongoose from 'mongoose'
import { randomBytes } from 'crypto'
import { hashSync } from 'bcrypt'

describe('UsersTests', () => {
	let app = build()
	let user: any

	beforeAll(async () => {
		const UserModel = mongoose.model('User', User)
		let initialUser = new UserModel({
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
		initialUser = await initialUser.save()
		user = initialUser
	})

	test('/users (GET)', async () => {
		const res = await app.inject({
			url: '/users',
			method: 'GET'
		})
		expect(res.statusCode === 200)
		expect(200)
		expect(JSON.parse(res.payload)).toEqual([{
			_id: expect.any(String),
			profile_image: expect.any(String),
			first_name: expect.any(String),
			last_name: expect.any(String),
			email: expect.any(String),
			email_token: expect.any(String) || null || '',
			confirmed: expect.any(Boolean),
			password: expect.any(String),
			events: [],
			created_at: expect.any(String),
			updated_at: expect.any(String),
			__v: 0
		}])
	})

	test('/users/:id (GET)', async () => {
		const res = await app.inject({
			url: `/users/${JSON.stringify(user._id).split('"')[1].toString()}`,
			method: 'GET'
		})
		expect(res.statusCode === 200)
		expect(JSON.parse(res.payload)).toEqual({
			_id: expect.any(String),
			profile_image: expect.any(String),
			first_name: expect.any(String),
			last_name: expect.any(String),
			email: expect.any(String),
			email_token: expect.any(String) || null || '',
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
			url: `/users/${JSON.stringify(user._id).split('"')[1].toString()}`,
			method: 'PATCH',
			payload: {
				email: "nejcrogelsek80@gmail.com",
				profile_image: "undefined",
				first_name: "UpdatedName",
				last_name: "UpdatedSurname"
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
			url: `/users/${JSON.stringify(user._id).split('"')[1].toString()}`,
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
