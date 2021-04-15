import wlc from '../database/waterline.mjs'

export default function Controller(routes) {
  routes.post('/owner', async (request, response) => {
    delete request.body.id // doesn't allow id to be set

    try {
      await wlc.owner.create(request.body)

      return response.json({ })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })

  routes.get('/owner', async (request, response) => {
    const owner = await wlc.owner.find({ where: { cpf: request.query.cpf }, limit: 20 })
      .meta({ makeLikeModifierCaseInsensitive: true })

    return response.json(owner)
  })

  routes.get('/owner/:id', async (request, response) => {
    const { id } = request.params
    const owner = await wlc.owner.findOne({ id })

    if (owner)
      return response.json(owner)

    return response.json({ err: 'not_found' })
  })

  routes.put('/owner/:id', async (request, response) => {
    const { id } = request.params
    delete request.body.id // doesn't allow id to be updated

    try {
      await wlc.owner.update({ id }).set(request.body)

      return response.json({ })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })
}
