// This file contains code that we reuse between our tests.
import Fastify from 'fastify'
import fp from 'fastify-plugin'
import App from '../src/app'

const config = async () => {
	return {}
}

const build = () => {
	const app = Fastify()

	beforeAll(async () => {
		void app.register(fp(App), await config())
		await app.ready()
	})

	afterAll(async () => await app.close())

	return app
}

export {
	config,
	build
}
