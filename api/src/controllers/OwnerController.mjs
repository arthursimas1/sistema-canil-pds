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
    const data = request.query
    let query = { }
    const allowed_props = [
      'name', 'cpf', 'email', 'gender', 'streetname', 'number', 'postalcode', 'state', 'city'
    ]

    for (const key in data) {
      if (allowed_props.includes(key) && typeof data[key] === 'string')
        query[key] = { startsWith: data[key] }
    }

    const owner = await wlc.owner.find({ where: query, limit: 20 })
      //.populate('owner')
      .meta({ makeLikeModifierCaseInsensitive: true })

    return response.json(owner)
  })

  routes.get('/owner/:id', async (request, response) => {
    const { id } = request.params
    const pet = await wlc.pet.findOne({ id }).populate('owner')

    if (pet)
      return response.json(pet)

    return response.json({ err: 'not_found' })
  })

  routes.put('/owner/:id', async (request, response) => {
    const { id } = request.params
    delete request.body.id // doesn't allow id to be updated
    //delete request.body.owner // doesn't allow owner to be updated by this route

    try {
      await wlc.owner.update({ id }).set(request.body)

      return response.json({ })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })
}
