import wlc from '../database/waterline.mjs'

export default function Controller(routes) {
  routes.post('/disease', async (request, response) => {
    delete request.body.id // doesn't allow id to be set

    try {
      const disease = await wlc.disease.create(request.body).fetch()

      await wlc.log.create({ user: request.body.user, table: 'disease', operation: 'create', key: disease.id })

      return response.json({ })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })

  routes.get('/disease', async (request, response) => {
    let { limit } = { limit: 20, ...request.query } // limit defaults to 20

    const owner = await wlc.disease.find({
      where: {
        or: [
          { name: { contains: request.query.text } },
          { description: { contains: request.query.text } },
        ],
        hidden: false,
      },
      limit,
    })
      .meta({ makeLikeModifierCaseInsensitive: true })

    return response.json(owner)
  })

  routes.get('/disease/:id', async (request, response) => {
    const { id } = request.params
    const owner = await wlc.disease.findOne({ id })

    if (owner)
      return response.json(owner)

    return response.json({ err: 'not_found' })
  })

  routes.put('/disease/:id', async (request, response) => {
    const { id } = request.params
    delete request.body.id // doesn't allow id to be updated

    try {
      await wlc.disease.update({ id }).set(request.body)

      await wlc.log.create({ user: request.body.user, table: 'disease', operation: 'update', key: id })

      return response.json({ })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })

  routes.delete('/disease/:id', async (request, response) => {
    const { id } = request.params

    try {
      await wlc.disease.update({ id }).set({ hidden: true })

      await wlc.log.create({ user: request.body.user, table: 'disease', operation: 'delete', key: id })

      return response.json({ })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })
}
