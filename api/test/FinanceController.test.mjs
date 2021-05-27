/*eslint-env node, mocha */

import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../src/index.mjs'
//import * as testingTools from './testingTools.mjs'

chai.use(chaiHttp)
let request = chai.request(app).keepOpen()

describe('FinanceController', () => {
  let events, expected_balance = 0, tokens = { not_logged_in: '' }
  before((done) => {
    events = [
      { amount: -3000, description: 'Pagamento de funcionário' },
      { amount: 2000, description: 'Venda de um PET' },
      { amount: 5000, description: 'Venda de um PET' },
      { amount: -1000, description: 'Compra de ração' },
    ]

    let token_count = 0
    request.post(`/login`)
      .send({
        email: 'admin@pds.3wx.ru',
        password: '123456',
      })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.not.have.property('err')

        res.body.should.have.property('token')
        tokens.admin = res.body.token

        if (++token_count === 2)
          done()
      })

    request.post(`/login`)
      .send({
        email: 'user@pds.3wx.ru',
        password: '123456',
      }).end((err, res) => {
      res.should.have.status(200)
      res.body.should.not.have.property('err')

      res.body.should.have.property('token')

      tokens.employee = res.body.token

      if (++token_count === 2)
        done()
    })
  });

  ['not_logged_in', 'admin', 'employee'].forEach((label) => {
    describe(`user role: ${label}`, () => {
      it(`should ${ label === 'admin' ? '' : 'not ' }get empty finance event`, (done) => {
        request.get(`/finance`)
          .set('authorization', tokens[label])
          .end((err, res) => {
            res.should.have.status(200)

            if (label === 'employee') {
              res.body.should.have.property('err')
              res.body.err.should.be.eql('not_allowed')
            } else if (label === 'admin') {
              res.body.should.have.property('balance')
              res.body.balance.should.be.eql(0)

              res.body.should.have.property('events')
              res.body.events.length.should.be.eql(0)
            } else {
              res.body.should.have.property('err')
              res.body.err.should.be.eql('auth')
            }

            done()
          })
      })
    })
  });

  ['not_logged_in', 'admin', 'employee'].forEach((label) => {
    describe(`user role: ${label}`, () => {
      it(`should ${ label === 'admin' ? '' : 'not ' }add finance event`, (done) => {
        let insertions = 0
        events.forEach((element) => {
          request.post(`/finance`)
            .send(element)
            .set('authorization', tokens[label])
            .end((err, res) => {
              res.should.have.status(200)

              if (label === 'not_logged_in') {
                res.body.should.have.property('err')
                res.body.err.should.be.eql('auth')
              } else {
                expected_balance += element.amount
                res.body.should.not.have.property('err')
              }

              if (++insertions === events.length)
                done()
            })
        })
      })
      it(`should ${ label === 'admin' ? '' : 'not ' }get all finance events`, (done) => {
        request.get(`/finance`)
          .set('authorization', tokens[label])
          .end((err, res) => {
            res.should.have.status(200)

            if (label === 'employee') {
              res.body.should.have.property('err')
              res.body.err.should.be.eql('not_allowed')
            } else if (label === 'admin') {
              res.body.should.have.property('balance')
              res.body.balance.should.be.eql(expected_balance)

              res.body.should.have.property('events')
              res.body.events.length.should.be.eql(events.length)
            } else {
              res.body.should.have.property('err')
              res.body.err.should.be.eql('auth')
            }

            done()
          })
      })
    })
  })
})
