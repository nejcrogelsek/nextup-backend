// This file contains code that we reuse between our tests.
import Fastify from 'fastify'
import fp from 'fastify-plugin'
import App from '../src/app'
import * as mongoose from 'mongoose'

const config = async () => {
	return {}
}

const build = () => {
	const app = Fastify()

	beforeAll(async () => {
		void app.register(fp(App), await config())
		await app.ready()
		await mongoose.connect('mongodb://admin:pass@localhost:27017', { dbName: '03-Nejc-Rogelsek' })
	})

	afterAll(async () => {
		await mongoose.connection.dropDatabase()
		await app.close()
	})

	return app
}

export {
	config,
	build
}
