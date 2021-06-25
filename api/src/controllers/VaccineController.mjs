import wlc from '../database/waterline.mjs'
import { ACL, Auth } from '../middlewares/authenticate.mjs'

export default function Controller(routes) {
  routes.post('/vaccine', Auth, async (request, response) => {
    const permission = ACL.can(request.user.roles).createAny('vaccine')
    if (!permission.granted) return response.json({ err: 'not_allowed' })

    delete request.body.id // doesn't allow id to be set

    try {
      const vaccine = await wlc.vaccine.create(request.body).fetch()

      await wlc.log.create({ user: request.user.name, table: 'vaccine', operation: 'create', key: vaccine.id })

      return response.json({ })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })

  routes.get('/vaccine', Auth, async (request, response) => {
    const permission = ACL.can(request.user.roles).readAny('vaccine')
    if (!permission.granted) return response.json({ err: 'not_allowed' })

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
      limit,
    })
      .meta({ makeLikeModifierCaseInsensitive: true })

    return response.json(vaccine)
  })

  routes.get('/vaccine/:id', Auth, async (request, response) => {
    const permission = ACL.can(request.user.roles).readAny('vaccine')
    if (!permission.granted) return response.json({ err: 'not_allowed' })

    const { id } = request.params
    const vaccine = await wlc.vaccine.findOne({ id })

    if (vaccine)
      return response.json(vaccine)

    return response.json({ err: 'not_found' })
  })

  routes.put('/vaccine/:id', Auth, async (request, response) => {
    const permission = ACL.can(request.user.roles).updateAny('vaccine')
    if (!permission.granted) return response.json({ err: 'not_allowed' })

    const { id } = request.params
    delete request.body.id // doesn't allow id to be updated

    try {
      const vaccine = await wlc.vaccine.update({ id }).set(request.body).fetch()

      await wlc.log.create({ user: request.user.name, table: 'vaccine', operation: 'update', key: id })

      return response.json({ })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })

  routes.delete('/vaccine/:id', Auth, async (request, response) => {
    const permission = ACL.can(request.user.roles).deleteAny('vaccine')
    if (!permission.granted) return response.json({ err: 'not_allowed' })

    const { id } = request.params

    try {
      const vaccine = await wlc.vaccine.update({ id }).set({ hidden: true }).fetch()

      await wlc.log.create({ user: request.user.name, table: 'vaccine', operation: 'delete', key: vaccine.id })

      return response.json({ })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })
}
