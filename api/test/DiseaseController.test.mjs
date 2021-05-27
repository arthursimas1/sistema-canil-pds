/*eslint-env node, mocha */

import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import app from '../src/index.mjs'
//import * as testingTools from './testingTools.mjs'

chai.use(chaiHttp)
let request = chai.request(app).keepOpen()

describe('DiseaseController', () => {
  let diseases, tokens = { not_logged_in: '' }
  before((done) => {
    diseases = [
        {
          name: 'Gripe canina',
          description: 'Sintomas: tosse, febre e corrimento nasal. A vacina para gripe canina não é recomendada para todos os cães (consultar o médico veterinário).',
        },
        {
          name: 'Raiva canina',
          description: 'O vírus é espalhado pela saliva, seja por uma mordida de um animal infectado ou por saliva que contamina uma ferida na pele. Além disso, qualquer contato com animais selvagens, pode trazer risco de infecção por raiva.',
        },
        {
          name: 'Cinomose canina',
          description: 'Sintomas: febre, corrimento ocular e nasal, tosse, diarreia, vômitos, convulsões e paralisia. Filhotes e cães adultos geralmente contraem a doença através de secreções respiratórias de cães infectados ou partículas do vírus no ar. A doença é muitas vezes fatal.',
        },
        {
          name: 'Parvovirose canina',
          description: 'Sintomas: tosse, febre e corrimento nasal. É causada pelo parvovírus. O vírus é muito contagioso e ataca o sistema gastrointestinal, causando vômito, febre e diarreia grave. É transmitido através do contato direto entre cães, bem como por fezes contaminadas, contato com o piso, tigelas, coleira, e até mãos ou roupas das pessoas.',
        },
        {
          name: 'Dirofilariose',
          description: 'Entre os sintomas estão tosse, problemas respiratórios, fraqueza, doença cardíaca e perda de peso. A dirofilariose é causada por parasitas que se alojam no coração do seu cão, causando danos no coração, vasos sanguíneos e pulmões. A doença é transmitida por mosquitos, e por isso é mais comum em períodos mais quentes do ano e em regiões litorâneas.',
        },
        {
          name: 'Doença de Lyme',
          description: 'Os sintomas podem ser perda de apetite, vômito, dor, febre e inflamação nas articulações que fazem o cão a mancar. A doença de Lyme também conhecida como borreliose é causada por uma bactéria chamada Borrelia burgdorferi, que é transmitida através da picada do carrapato.',
        },
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
      it(`should ${ label === 'admin' ? '' : 'not ' }add diseases`, (done) => {
        let insertions = 0
        diseases.forEach((element) => {
          request.post(`/disease`)
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

              if (++insertions === diseases.length)
                done()
            })
        })
      })
      it('search for "raiva"', (done) => {
        request.get(`/disease`)
          .query({ text: 'raiva' })
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
      it('get all diseases', (done) => {
        request.get(`/disease`)
          .query({ text: '' })
          .set('authorization', tokens[label])
          .end((err, res) => {
            res.should.have.status(200)

            if (label === 'not_logged_in') {
              res.body.should.have.property('err')
              res.body.err.should.be.eql('auth')
            } else {
              res.body.should.not.have.property('err')
              res.body.length.should.be.eql(diseases.length)
            }

            done()
          })
      })
    })
  })
})
