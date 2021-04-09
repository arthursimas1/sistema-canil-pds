import wlc from '../database/waterline.mjs'

export default function Controller(routes) {
  routes.post('/pet', async (request, response) => {
    delete request.body.id // doesn't allow id to be set

    try {
      await wlc.pet.create(request.body)

      return response.json({ })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })

  routes.get('/pet', async (request, response) => {
    const pet = await wlc.pet.find({ where: request.body }).populate('owner')

    return response.json(pet)
  })

  routes.get('/pet/:id', async (request, response) => {
    const { id } = request.params
    const pet = await wlc.pet.findOne({ id }).populate('owner')

    if (pet)
      return response.json(pet)

    return response.json({ err: 'not_found' })
  })

  routes.put('/pet/:id', async (request, response) => {
    const { id } = request.params
    delete request.body.id // doesn't allow id to be updated
    delete request.body.owner // doesn't allow owner to be updated by this route

    try {
      await wlc.pet.update({ id }).set(request.body)

      return response.json({ })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })
}
