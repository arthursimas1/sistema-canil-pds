import wlc from '../database/waterline.mjs'

export default function Controller(routes) {
  routes.post('/log', async (request, response) => {
    delete request.body.id // doesn't allow id to be set

    try {
      await wlc.log.create(request.body)

      return response.json({ })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })
  
  routes.get('/log', async (request, response) => {
    const logs = await wlc.log.find({
      sort: 'date DESC',
    })

    return response.json(logs)
  })
}
