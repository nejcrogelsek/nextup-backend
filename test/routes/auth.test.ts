import { build } from '../helper'
import { IUserTest } from '../interfaces/user.interface'

describe('AuthTests', () => {
	let app = build()
	let user: IUserTest

	test('/auth/register (POST)', async () => {
		const res = await app.inject({
			url: '/auth/register',
			method: 'POST',
			payload: {
				email: 'john@gmail.com',
				profile_image: 'johndoe.png',
				first_name: 'John',
				last_name: 'Doe',
				password: 'New123!'
			}
		})
		expect(res.statusCode === 201)
		expect(JSON.parse(res.payload)).toEqual({
			user: {
				email: 'john@gmail.com',
				profile_image: 'johndoe.png',
				first_name: 'John',
				last_name: 'Doe'
			}
		})
		user = JSON.parse(res.payload).user
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
				profile_image: 'johndoe.png',
				first_name: 'John',
				last_name: 'Doe'
			}
		})
	})
})
