import wlc from '../database/waterline.mjs'

export default function Controller(routes) {
  routes.post('/finance', async (request, response) => {
    delete request.body.id // doesn't allow id to be set
    request.body.date = new Date().toISOString()

    try {
      await wlc.finance.create(request.body)

      return response.json({ })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })

  routes.get('/finance', async (request, response) => {
    const balance = await wlc.finance.sum('amount')

    const events = await wlc.finance.find({
      sort: 'date DESC',
    })

    return response.json({ balance, events })
  })
}
