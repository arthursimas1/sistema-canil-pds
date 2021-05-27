/*eslint-env node, mocha */

import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import app from '../src/index.mjs'
//import * as testingTools from './testingTools.mjs'

chai.use(chaiHttp)
let request = chai.request(app).keepOpen()

describe('VaccineController', () => {
  let vaccines, expected_vaccines = 0
  before(() => {
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
  })
  it('empty vaccine', (done) => {
    request.get(`/vaccine`).query({ text: '' })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.not.have.property('err')

        res.body.length.should.be.eql(0)

        done()
      })    
    
  })
  it('adding vaccines', (done) => {
    vaccines.forEach((element) => {
      expected_vaccines += 1
      request.post(`/vaccine`)
        .send(element)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.not.have.property('err')
        })
    })    
    done()
  })
  it('search for "primo"', (done) => {
    request.get(`/vaccine`).query({ text: 'primo' })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.not.have.property('err')

        res.body.length.should.be.eql(1)

        done()
      })
  })
  it('get all vaccines', (done) => {
    request.get(`/vaccine`).query({ text: '' })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.not.have.property('err')

        res.body.length.should.be.eql(expected_vaccines)

        done()
      })
  })
})