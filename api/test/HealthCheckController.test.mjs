/*eslint-env node, mocha */

import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../src/index.mjs'
//import * as testingTools from './testingTools.mjs'

chai.use(chaiHttp)
let request = chai.request(app).keepOpen()

describe('HealthCheckController', () => {
  describe('health check', () => {
    it('getting health status', (done) => {
      request.get('/health_check')
        .set('authorization', 'h%mA5Uv&*q8i4Ler')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message')
          res.body.message.should.be.eql('OK')
          done()
        })
    })
    it('no authorization token', (done) => {
      request.get('/health_check')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('err')
          res.body.err.should.be.eql('auth')
          done()
        })
    })
    it('wrong authorization token', (done) => {
      request.get('/health_check')
        .set('authorization', '7emNDOoksdfo@@#dadv0')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('err')
          res.body.err.should.be.eql('auth')
          done()
        })
    })
    //after(() => testingTools.StartDatabase())
  })
})

