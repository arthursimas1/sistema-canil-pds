import wlc from '../database/waterline.mjs'
import { ACL, Auth } from '../middlewares/authenticate.mjs'

export default function Controller(routes) {
  routes.get('/log', Auth, async (request, response) => {
    const permission = ACL.can(request.user.roles).readAny('log')
    if (!permission.granted) return response.json({ err: 'not_allowed' })

    const events = await wlc.log.find({
      sort: 'date DESC',
    })

    return response.json(events)
  })
}
