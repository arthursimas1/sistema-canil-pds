import wlc from '../database/waterline.mjs'

export default function Controller(routes) {
  routes.post('/owner', async (request, response) => {
    delete request.body.id // doesn't allow id to be set

    try {
      const owner = await wlc.owner.create(request.body).fetch()

      await wlc.log.create({ user: request.body.user, table: 'owner', operation: 'create', key: owner.id })

      return response.json({ owner: owner.id })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })

  routes.get('/owner', async (request, response) => {
    const owner = await wlc.owner.find({ cpf: request.query.cpf })

    return response.json(owner)
  })

  routes.get('/owner/:id', async (request, response) => {
    const { id } = request.params
    const owner = await wlc.owner.findOne({ id }).populate('current_pets').populate('previous_pets')

    if (owner)
      return response.json(owner)

    return response.json({ err: 'not_found' })
  })

  routes.put('/owner/:id', async (request, response) => {
    const { id } = request.params
    delete request.body.id // doesn't allow id to be updated

    try {
      await wlc.owner.update({ id }).set(request.body)

      await wlc.log.create({ user: request.body.user, table: 'owner', operation: 'update', key: id })

      return response.json({ })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })
}
