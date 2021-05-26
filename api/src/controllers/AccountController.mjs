import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from 'config'
import wlc from '../database/waterline.mjs'

export default function Controller(routes) {
  routes.post('/login', async (request, response) => {
    const {
      username,
      password,
    } = request.body

    const user = await wlc.user.findOne({ username: username.toLowerCase().trim() })

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id }, config.get('jwt_secret'))

      return response.json({ token, name: user.name, roles: user.roles })
    }

    return response.json({ err: 'wrong_credentials' })
  })
}
