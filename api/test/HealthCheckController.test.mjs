/*eslint-env node, mocha */

import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../src/index.mjs'
//import * as testingTools from './testingTools.mjs'

chai.use(chaiHttp)
let request = chai.request(app).keepOpen()

describe('HealthCheckController', () => {
  it('getting health status', (done) => {
    request.get('/health_check')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('message')
        res.body.message.should.be.eql('OK')
        done()
      })
  })
})

