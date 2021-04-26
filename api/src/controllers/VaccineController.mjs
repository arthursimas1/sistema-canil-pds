import wlc from '../database/waterline.mjs'

export default function Controller(routes) {
  routes.post('/vaccine', async (request, response) => {
    delete request.body.id // doesn't allow id to be set

    try {
      await wlc.vaccine.create(request.body)

      return response.json({ })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })

  routes.get('/vaccine', async (request, response) => {
    let { limit } = { limit: 20, ...request.query } // limit defaults to 20

    const vaccine = await wlc.vaccine.find({
      where: {
        or: [
          { name: { contains: request.query.text } },
          { manufacturer: { contains: request.query.text } },
          { description: { contains: request.query.text } },
        ],
        hidden: false,
      },
      limit
    })
      .meta({ makeLikeModifierCaseInsensitive: true })

    return response.json(vaccine)
  })

  routes.get('/vaccine/:id', async (request, response) => {
    const { id } = request.params
    const vaccine = await wlc.vaccine.findOne({ id })

    if (vaccine)
      return response.json(vaccine)

    return response.json({ err: 'not_found' })
  })

  routes.put('/vaccine/:id', async (request, response) => {
    const { id } = request.params
    delete request.body.id // doesn't allow id to be updated

    try {
      await wlc.vaccine.update({ id }).set(request.body)

      return response.json({ })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })

  routes.delete('/vaccine/:id', async (request, response) => {
    const { id } = request.params

    try {
      await wlc.vaccine.update({ id }).set({ hidden: true })

      return response.json({ })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })
}
