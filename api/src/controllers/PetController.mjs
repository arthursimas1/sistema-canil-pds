import wlc from '../database/waterline.mjs'

export default function Controller(routes) {
  routes.post('/pet', async (request, response) => {
    delete request.body.id // doesn't allow id to be set

    try {
      const pet = await wlc.pet.create(request.body).fetch()
      await wlc.pet_timeline.create({
        event: 'new_pet',
        date: new Date().toISOString(),
        pet: pet.id,
      })

      return response.json({ })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })

  routes.get('/pet', async (request, response) => {
    const data = request.query
    let query = { }
    const allowed_props = [
      'name', 'breed', 'gender', 'owner',
    ]

    for (const key in data) {
      if (allowed_props.includes(key) && typeof data[key] === 'string')
        query[key] = { startsWith: data[key] }
    }

    const pet = await wlc.pet.find({ where: query, limit: 20 })
      .populate('owner')
      .meta({ makeLikeModifierCaseInsensitive: true })

    return response.json(pet)
  })

  routes.get('/pet/:id', async (request, response) => {
    const { id } = request.params
    const pet = await wlc.pet.findOne({ id }).populate('owner').populate('previous_owners')

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

  routes.put('/pet/:pet/timeline', async (request, response) => {
    delete request.body.id // doesn't allow id to be set

    const { pet } = request.params
    const date = new Date().toISOString()

    try {
      const { event, description, metadata } = request.body

      if (['new_pet', 'ownership_transfer', 'vaccination', 'sick', 'other'].indexOf(event) < 0)
        return response.json({ err: 'invalid_event' })

      await wlc.pet_timeline.create({ pet, date, event, description, metadata })

      if (event === 'ownership_transfer') {
        await wlc.pet.update({ id: pet }).set({ owner: metadata['new_owner'] })
        await wlc.pet.addToCollection(pet, 'previous_owners', metadata['previous_owner'])
        await wlc.pet.removeFromCollection(pet, 'previous_owners', metadata['new_owner'])
      }

      return response.json({ })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })

  routes.get('/pet/:pet/timeline', async (request, response) => {
    const { pet } = request.params
    let timeline = await wlc.pet_timeline.find({ where: { pet }, sort: 'date ASC' })

    timeline = await Promise.all(timeline.map(async (e) => {
      switch (e.event) {
        case 'ownership_transfer':
          e.metadata.previous_owner = await wlc.owner.findOne({ id: e.metadata.previous_owner }) // eslint-disable-line require-atomic-updates
          e.metadata.new_owner = await wlc.owner.findOne({ id: e.metadata.new_owner }) // eslint-disable-line require-atomic-updates
          break

        case 'vaccination':
          e.metadata.vaccine = await wlc.vaccine.findOne({ id: e.metadata.vaccine }) // eslint-disable-line require-atomic-updates
          break

        case 'sick':
          e.metadata.disease = await wlc.disease.findOne({ id: e.metadata.disease }) // eslint-disable-line require-atomic-updates
          break
      }
      delete e.pet

      return e
    }))

    return response.json(timeline)
  })
}
