import express from 'express'
import cors from 'cors'
import config from 'config'

const app = express()
export default app

app.use(cors())

app.use(express.json())

// routes setup
const routes = express.Router()

import PetController from './controllers/PetController.mjs'
PetController(routes)

import HealthCheckController from './controllers/healthCheckController.mjs'
HealthCheckController(routes)

app.use(routes)

const http_port = config.get('http_port')

if (process.env.NODE_ENV !== 'test') {
  app.listen(http_port, () => {
    console.info(`HTTP backend server listening on port ${http_port}`)
  })
}
