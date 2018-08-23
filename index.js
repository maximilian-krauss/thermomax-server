require('make-promises-safe')
require('dotenv').config()

const path = require('path')
const config = require('./config')
const { handleIndex, handleUpdate, handleGetAll } = require('./handler')

async function runServer () {
  const fastify = require('fastify')({
    logger: true
  })
  const port = parseInt(config.port || '3000', 10)

  fastify.register(require('fastify-no-icon'))
  fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/'
  })

  fastify.route({
    method: 'GET',
    url: '/',
    handler: handleIndex
  })

  fastify.route({
    method: 'GET',
    url: '/api/',
    handler: handleGetAll
  })

  fastify.route({
    method: 'POST',
    url: '/api/update',
    beforeHandler: (request, reply, done) => {
      const authHeader = request.headers['authorization']
      const serverKey = `Bearer ${config.apiKey}`

      if (authHeader !== serverKey) {
        return reply.code(401).send({ error: 'Invalid API key' })
      }

      done()
    },
    handler: handleUpdate
  })

  await fastify.ready()

  fastify.listen(port, '0.0.0.0', (err, address) => {
    if (err) throw err
    fastify.log.info(address)
  })
}

runServer().catch(err => {
  console.error(err)
  process.exit(1)
})
