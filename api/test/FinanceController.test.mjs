/*eslint-env node, mocha */

import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../src/index.mjs'
//import * as testingTools from './testingTools.mjs'

chai.use(chaiHttp)
let request = chai.request(app).keepOpen()

describe('FinanceController', () => {
  let events, expected_balance = 0
  before(() => {
    events = [
    {amount: -3000,description: "Pagamento de funcionário"},
    {amount: 2000,description: "Venda de um PET"},
    {amount: 5000,description: "Venda de um PET"},
    {amount: -1000,description: "Compra de ração"},]
  })
  it('empty finance events', (done) => {
    request.get(`/finance`)
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.not.have.property('err')

      res.body.should.have.property('balance')
      res.body.balance.should.be.eql(0)

      res.body.should.have.property('events')
      res.body.events.length.should.be.eql(0)

      done()
    })    
    
  })
  it('adding finance event', (done) => {
    events.forEach((element) => {
      expected_balance += element.amount
      request.post(`/finance`)
      .send(element)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.not.have.property('err')        
      })
    })    
    done()
  })
  it('get all finance events', (done) => {
    request.get(`/finance`)
      .end((err, res) => {        
        res.should.have.status(200)
        res.body.should.not.have.property('err')

        res.body.should.have.property('balance')
        res.body.balance.should.be.eql(expected_balance)

        res.body.should.have.property('events')
        res.body.events.length.should.be.eql(4)

        done()
      })
  })
})