/*eslint-env node, mocha */

import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../src/index.mjs'
//import * as testingTools from './testingTools.mjs'

chai.use(chaiHttp)
let request = chai.request(app).keepOpen()

describe('VaccineController', () => {
  let vaccines, tokens = { not_logged_in: '' }
  before((done) => {
    vaccines = [
    {
      name: "Primo-vacinação",
      manufacturer: "diversos",
      description: "Tomar ao perfazer 6 semanas."
    },
    {
      name: "Vacina Trivalente",
      manufacturer: "diversos",
      description: "Tomar às 12 semanas depois anualmente. Confere imunidade contra: cinomose canina, hepatite infecciosa canina e leptospirose."
    },
    {
      name: "Vacina Tetravalente",
      manufacturer: "diversos",
      description: "Tomar às 12 semanas depois anualmente. Confere imunidade contra: cinomose canina, hepatite infecciosa canina, leptospirose e parvovirose canina."
    },
    {
      name: "Vacina Polivalente",
      manufacturer: "diversos",
      description: "Tomar às 12 semanas depois anualmente. Confere imunidade contra: cinomose canina, hepatite infecciosa canina, leptospirose, parvovirose canina, tosse dos canis e coronavírus canino."
    },]
  
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
      it(`should ${ label === 'admin' ? '' : 'not ' }add vaccines`, (done) => {
        let insertions = 0
        vaccines.forEach((element) => {
          request.post(`/vaccine`)
            .send(element)
            .set('authorization', tokens[label])
            .end((err, res) => {
              res.should.have.status(200)

              if (label === 'admin') {
                res.body.should.not.have.property('err')
              } else {
                res.body.should.have.property('err')

                if (label === 'employee')
                  res.body.err.should.be.eql('not_allowed')
                else
                  res.body.err.should.be.eql('auth')
              }

              if (++insertions === vaccines.length)
                done()
            })
        })
      })
      it('search for "primo"', (done) => {
        request.get(`/vaccine`)
          .query({ text: 'primo' })
          .set('authorization', tokens[label])
          .end((err, res) => {
            res.should.have.status(200)

            if (label === 'not_logged_in') {
              res.body.should.have.property('err')
              res.body.err.should.be.eql('auth')
            } else {
              res.body.should.not.have.property('err')
              res.body.length.should.be.eql(1)
            }

            done()
          })
      })
      it('get all vaccines', (done) => {
        request.get(`/vaccine`)
          .query({ text: '' })
          .set('authorization', tokens[label])
          .end((err, res) => {
            res.should.have.status(200)

            if (label === 'not_logged_in') {
              res.body.should.have.property('err')
              res.body.err.should.be.eql('auth')
            } else {
              res.body.should.not.have.property('err')
              res.body.length.should.be.eql(vaccines.length)
            }

            done()
          })
      })
    })
  })
})
