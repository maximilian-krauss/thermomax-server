const poorMansDB = {}

module.exports = {
  async addOrUpdate (model) {
    poorMansDB[model.id] = model
  },
  async getAll () {
    return Object.keys(poorMansDB)
      .reduce((acc, next) => {
        acc.push(poorMansDB[next])
        return acc
      }, [])
  }
}
