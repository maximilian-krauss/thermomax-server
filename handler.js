const store = require('./store')

module.exports = {
  handleIndex (request, reply) {
    reply.code(200).sendFile('index.html')
  },

  async handleUpdate (request, reply) {
    await store.addOrUpdate(request.body)

    return { status: 'ok' }
  },

  async handleGetAll (request, reply) {
    const data = await store.getAll()
    return data
  }
}
