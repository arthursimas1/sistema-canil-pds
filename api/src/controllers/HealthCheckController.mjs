import assert from 'assert'
import wlc from '../database/waterline.mjs'
import { AuthHealthCheck } from '../middlewares/authenticate.mjs'

export default function Controller(routes) {
  routes.get('/health_check', AuthHealthCheck, async (request, response) => {
    let health_check = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
    }

    try {
      assert.strictEqual(await wlc.user.count() > 0, true)

      return response.json(health_check)
    } catch (e) {
      console.log(e)
      health_check.message = e

      return response.status(503).json(health_check)
    }
  })
}
