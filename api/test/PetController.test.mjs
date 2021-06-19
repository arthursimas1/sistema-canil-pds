/*eslint-env node, mocha */

import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../src/index.mjs'
import wlc from '../src/database/waterline.mjs'
//import * as testingTools from './testingTools.mjs'

chai.use(chaiHttp)
let request = chai.request(app).keepOpen()

describe('PetController', () => {
  let pets_set1, pets_set2, tokens = { not_logged_in: '' }
  before((done) => {
    pets_set1 = [
      {
        name: 'Forrest Gump',
        breed: 'Sem raça definida (SRD)',
        birthdate: '2019-01-08T11:11:00.000Z',
        gender: 'Macho',
        owner: 'zPR1i264oBj6q51DuzFKI',
        previous_owners: ['dEWVp2db7x_PzZvl9GKfO'],
      },
      {
        name: 'Amora',
        breed: 'Sem raça definida (SRD)',
        birthdate: '2018-01-10T11:11:00.000Z',
        gender: 'Fêmea',
        owner: 'dEWVp2db7x_PzZvl9GKfO',
      },]

    pets_set2 = [
      {
        name: 'Rex',
        breed: 'Sem raça definida (SRD)',
        birthdate: '2019-01-08T11:11:00.000Z',
        gender: 'Macho',
        owner: 'zPR1i264oBj6q51DuzFKI',
        previous_owners: ['dEWVp2db7x_PzZvl9GKfO'],
      },
      {
        name: 'Fofo',
        breed: 'Sem raça definida (SRD)',
        birthdate: '2018-01-10T11:11:00.000Z',
        gender: 'Fêmea',
        owner: 'dEWVp2db7x_PzZvl9GKfO',
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

  describe(`user role: not_logged_in`, () => {
    it(`should not add pets`, (done) => {
      let insertions = 0
      pets_set1.forEach((element) => {
        request.post(`/pet`)
          .send(element)
          .set('authorization', tokens['not_logged_in'])
          .end((err, res) => {
            res.should.have.status(200)

            res.body.should.have.property('err')
            res.body.err.should.be.eql('auth')

            if (++insertions === pets_set1.length)
              done()
          })
      })
    })
    it('search for name Amora', (done) => {
      request.get(`/pet`)
        .query({ name: 'Amora' })
        .set('authorization', tokens['not_logged_in'])
        .end((err, res) => {
          res.should.have.status(200)

          res.body.should.have.property('err')
          res.body.err.should.be.eql('auth')

          done()
        })
    })
    it('get all pets', (done) => {
      request.get(`/pet`)
        .query({ text: '' })
        .set('authorization', tokens['not_logged_in'])
        .end((err, res) => {
          res.should.have.status(200)

          res.body.should.have.property('err')
          res.body.err.should.be.eql('auth')

          done()
        })
    })
  })

  describe(`user role: admin`, () => {
    it(`should add pets`, (done) => {
      let insertions = 0
      pets_set1.forEach((element) => {
        request.post(`/pet`)
          .send(element)
          .set('authorization', tokens['admin'])
          .end((err, res) => {
            res.should.have.status(200)

            res.body.should.not.have.property('err')

            if (++insertions === pets_set1.length)
              done()
          })
      })
    })
    it('search for name Amora', (done) => {
      request.get(`/pet`)
        .query({ name: 'Amora' })
        .set('authorization', tokens['admin'])
        .end((err, res) => {
          res.should.have.status(200)

          res.body.should.not.have.property('err')
          res.body.length.should.be.eql(1)

          done()
        })
    })
    it('get all pets', (done) => {
      request.get(`/pet`)
        .query({ text: '' })
        .set('authorization', tokens['admin'])
        .end((err, res) => {
          res.should.have.status(200)

          res.body.should.not.have.property('err')
          res.body.length.should.be.eql(pets_set1.length)

          done()
        })
    })
  })  

  describe(`user role: employee`, () => {
    it(`should add pets`, (done) => {
      let insertions = 0
      pets_set2.forEach((element) => {
        request.post(`/pet`)
          .send(element)
          .set('authorization', tokens['employee'])
          .end((err, res) => {
            res.should.have.status(200)

            res.body.should.not.have.property('err')

            if (++insertions === pets_set2.length)
              done()
          })
      })
    })
    it('search for name Fofo', (done) => {
      request.get(`/pet`)
        .query({ name: 'Fofo' })
        .set('authorization', tokens['employee'])
        .end((err, res) => {
          res.should.have.status(200)

          res.body.should.not.have.property('err')
          res.body.length.should.be.eql(1)

          done()
        })
    })
    it('get all pets', (done) => {
      request.get(`/pet`)
        .query({ text: '' })
        .set('authorization', tokens['employee'])
        .end((err, res) => {
          res.should.have.status(200)

          res.body.should.not.have.property('err')
          res.body.length.should.be.eql(pets_set1.length + pets_set2.length)

          done()
        })
    })
  })
})
