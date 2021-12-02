import { build } from '../helper'
import { IUserTest } from '../interfaces/user.interface'
import { hashSync } from 'bcrypt'

describe('AuthTests', () => {
	let app = build()
	let user: IUserTest

	test('/auth/register (POST)', async () => {
		const res = await app.inject({
			url: '/auth/register',
			method: 'POST',
			payload: {
				email: 'spela@gmail.com',
				profile_image: 'spela.png',
				first_name: 'Špela',
				last_name: 'Špelasta',
				password: hashSync('New123!', 10)
			}
		})
		expect(res.statusCode === 201)
		expect(JSON.parse(res.payload)).toEqual({
			user: {
				email: 'spela@gmail.com',
				profile_image: 'spela.png',
				first_name: 'Špela',
				last_name: 'Špelasta',
				email_token: expect.any(String)
			}
		})
		user = JSON.parse(res.payload).user
	})

	test('/auth/verify-email (GET)', async () => {
		const res = await app.inject({
			url: `/auth/verify-email?token=${user.email_token}`,
			method: 'GET',
			query: { token: user.email_token }
		})
		expect(res.statusCode === 200)
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
				email: 'spela@gmail.com',
				profile_image: 'spela.png',
				first_name: 'Špela',
				last_name: 'Špelasta'
			}
		})
	})

})
