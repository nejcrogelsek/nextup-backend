import { FastifyError, FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

export interface SwaggerPluginOptions {
	// Specify Swagger plugin options here
}

export default fp(async (
	fastify: FastifyInstance,
	opts: SwaggerPluginOptions,
	next: (error?: FastifyError) => void
) => {

	next()
})