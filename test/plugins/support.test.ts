import Fastify from 'fastify'
import Support from '../../src/plugins/support'

test('support works standalone', async () => {
	const fastify = Fastify()
	void fastify.register(Support)
	await fastify.ready()

	expect(fastify.generateUploadUrl()).toEqual({ url: expect.any(String) })
})
