import Fastify from 'fastify'
import Support from '../../src/plugins/support'

test('someSupport() - testing', async () => {
	const fastify = Fastify()
	void fastify.register(Support)
	await fastify.ready()

<<<<<<< HEAD
  t.equal(fastify.generateUploadUrl(), '')
=======
	expect(fastify.someSupport()).toBe('hugs')

	await fastify.close()
})

test('generateUploadUrl', async () => {
	const fastify = Fastify()
	void fastify.register(Support)
	await fastify.ready()

	expect(fastify.generateUploadUrl()).toEqual(Promise.resolve({ url: expect.any(String) }))

	await fastify.close()
>>>>>>> feature/07-testing-with-jest
})
