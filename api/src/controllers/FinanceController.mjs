import wlc from '../database/waterline.mjs'
import { ACL, Auth } from '../middlewares/authenticate.mjs'

export default function Controller(routes) {
  routes.post('/finance', Auth, async (request, response) => {
    const permission = ACL.can(request.user.roles).createAny('finance')
    if (!permission.granted) return response.json({ err: 'not_allowed' })

    delete request.body.id // doesn't allow id to be set

    try {
      // date set at modeling level
      const finance = await wlc.finance.create(request.body).fetch()

      await wlc.log.create({ user: request.body.user, table: 'finance', operation: 'create', key: finance.id })

      return response.json({ })
    } catch (e) {
      console.log(e)

      return response.json({ err: 'internal' })
    }
  })

  routes.get('/finance', Auth, async (request, response) => {
    const permission = ACL.can(request.user.roles).readAny('finance')
    if (!permission.granted) return response.json({ err: 'not_allowed' })

    const balance = await wlc.finance.sum('amount')

    const events = await wlc.finance.find({
      sort: 'date DESC',
    })

    // https://stackoverflow.com/questions/33631041/javascript-async-await-in-replace
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
