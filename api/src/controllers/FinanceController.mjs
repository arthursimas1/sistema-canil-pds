import wlc from '../database/waterline.mjs'

export default function Controller(routes) {
  routes.post('/finance', async (request, response) => {
    delete request.body.id // doesn't allow id to be set

    try {
      // date set at modeling level
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

    async function ReplaceAsync(str, regex, asyncFn) {
      const promises = []
      str.replace(regex, (match, ...args) => {
        const promise = asyncFn(match, ...args)
        promises.push(promise)
      })
      const data = await Promise.all(promises)

      return str.replace(regex, () => data.shift())
    }

    for (const event of events) {
      event.description = await ReplaceAsync(event.description, /\[(.*?)\]\((.*?)\)/g, async (str, collection, id) => {
        let page = collection === 'pet' ? 'pet-timeline' : collection

        return `<a href='${page}/${id}'>${(await wlc[collection].findOne({ id })).name}</a>`
      })
    }

    return response.json({ balance, events })
  })
}
