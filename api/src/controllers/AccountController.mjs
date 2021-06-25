import bcrypt from 'bcryptjs'
import wlc from '../database/waterline.mjs'
import { ACL, Auth } from '../middlewares/authenticate.mjs'
import tokenlib from '../helper/tokenlib.mjs'

export default function Controller(routes) {
  routes.post('/login', async (request, response) => {
    const {
      email,
      password,
    } = request.body

    const user = await wlc.user.findOne({ email: email.toLowerCase().trim(), disabled: false })

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = await tokenlib.Create({ sub: user.id, aud: tokenlib.AUDIENCES.AUTH })

      return response.json({ token, name: user.name, roles: user.roles })
    }

    return response.json({ err: 'wrong_credentials' })
  })

  routes.get('/users', Auth, async (request, response) => {
    const permission = ACL.can(request.user.roles).readAny('user')
    if (!permission.granted) return response.json({ err: 'not_allowed' })

    const users = await wlc.user.find({ omit: ['password'] })

    users.forEach((user) => {
      if (user.id === request.user.id)
        user.me = true
    })

    return response.json({ users })
  })

  routes.put('/user/:id', Auth, async (request, response) => {
    const permission = ACL.can(request.user.roles).updateAny('user')
    if (!permission.granted) return response.json({ err: 'not_allowed' })

    const { id } = request.params

    try {
      const account = await wlc.user.updateOne({ id }).set(request.body).fetch()

      await wlc.log.create({ user: request.user.name, table: 'user', operation: 'update', key: account.id })
    } catch (e) {
      if (e.code === 'E_UNIQUE' && e.attrNames.indexOf('email') > -1)
        return response.json({ err: 'duplicate_email' })

      console.log(`ERROR UPDATING! user: ${request.user.id}, updater: ${JSON.stringify(request.body)}`)
      console.log(e)

      return response.json({ err: 'internal' })
    }

    return response.json({ })
  })

  routes.post('/user', Auth, async (request, response) => {
    const permission = ACL.can(request.user.roles).createAny('user')
    if (!permission.granted) return response.json({ err: 'not_allowed' })

    try {
      const account = await wlc.user.create(request.body).fetch()

      await wlc.log.create({ user: request.user.name, table: 'user', operation: 'create', key: account.id })
    } catch (e) {
      if (e.code === 'E_UNIQUE' && e.attrNames.indexOf('email') > -1)
        return response.json({ err: 'duplicate_email' })

      console.log(`ERROR UPDATING! user: ${request.user.id}, updater: ${JSON.stringify(request.body)}`)
      console.log(e)

      return response.json({ err: 'internal' })
    }

    return response.json({ })
  })

  routes.get('/my-account', Auth, async (request, response) => {
    const permission = ACL.can(request.user.roles).readOwn('user')
    if (!permission.granted) return response.json({ err: 'not_allowed' })

    const user = await wlc.user.findOne({
      where: { id: request.user.id },
      select: permission.attributes,
    })

    return response.json(user)
  })

  routes.put('/my-account', Auth, async (request, response) => {
    const permission = ACL.can(request.user.roles).updateOwn('user')
    if (!permission.granted) return response.json({ err: 'not_allowed' })

    const data = request.body
    let updater = permission.filter(data)

    if (updater.password && updater.password.length < 5)
      delete updater.password

    try {
      const account = await wlc.user.updateOne({ id: request.user.id }).set(updater).fetch()

      await wlc.log.create({ user: request.user.name, table: 'user', operation: 'update', key: account.id })
    } catch (e) {
      if (e.code === 'E_UNIQUE' && e.attrNames.indexOf('email') > -1)
        return response.json({ err: 'duplicate_email' })

      console.log(`ERROR UPDATING! user: ${request.user.id}, updater: ${JSON.stringify(updater)}`)
      console.log(e)

      return response.json({ err: 'internal' })
    }

    return response.json({})
  })
}
