import wlc from '../database/waterline.mjs'

export default function Controller(routes) {
  routes.post('/finance', async (request, response) => {
    delete request.body.id // doesn't allow id to be set

    try {
      await wlc.finance.create(request.body)

      return response.json({ })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })

  routes.get('/finance', async (request, response) => {
    let { limit } = { limit: 20, ...request.query } // limit defaults to 20

    const sum = await wlc.finance.sum('amount')
    
    const finance = await wlc.finance.find({
      sort: 'date'
    })

    return response.json({sum, finance})
  })
}
