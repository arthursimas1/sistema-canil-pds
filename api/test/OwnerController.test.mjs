/*eslint-env node, mocha */

import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../src/index.mjs'
import wlc from '../src/database/waterline.mjs'
//import * as testingTools from './testingTools.mjs'

chai.use(chaiHttp)
let request = chai.request(app).keepOpen()

describe('OwnerController', () => {
  let owners_set1, owners_set2, tokens = { not_logged_in: '' }
  before((done) => {
    owners_set1 = [
      {
        name: "Arthur Simas",
        cpf: "426.369.178-45",
        email: "arthursimas1@gmail.com",
        gender: "Masculino",
        birthdate: "2000-06-18T02:25:00.000Z",
        streetname: "Rua Benvenuto Di Giovani",
        number: "214",
        postalcode: "05551-000",
        state: "SP",
        city: "São Paulo",
        lat: -23.588230,
        lng: -46.760350,
        notes: "",
        has_animals: false,
        had_animals: true,
      },
      {
        name: "Guilherme Riveira",
        cpf: "126.255.668-40",
        email: "gui.riv@gmail.com",
        gender: "Masculino",
        birthdate: "2000-07-20T02:25:00.000Z",
        streetname: "Av. Salim Farah Maluf",
        number: "560",
        postalcode: "03304-090",
        state: "SP",
        city: "São Paulo",
        lat: -23.555157,
        lng: -46.5771222,
        notes: "",
        has_animals: false,
        had_animals: false,
      },]

    owners_set2 = [
      {
        name: "João Macedo",
        cpf: "351.369.934-51",
        email: "joaomacedo@gmail.com",
        gender: "Masculino",
        birthdate: "2000-06-18T02:25:00.000Z",
        streetname: "Rua Benvenuto Di Giovani",
        number: "37",
        postalcode: "05520-000",
        state: "SP",
        city: "São Paulo",
        lat: -23.588230,
        lng: -46.760350,
        notes: "",
        has_animals: false,
        had_animals: true,
      },
      {
        name: "Maria Fernanda",
        cpf: "185.120.157-44",
        email: "mariafernanda@gmail.com",
        gender: "Feminino",
        birthdate: "2000-07-20T02:25:00.000Z",
        streetname: "Av. Salim Farah Maluf",
        number: "24",
        postalcode: "03340-090",
        state: "SP",
        city: "São Paulo",
        lat: -23.555157,
        lng: -46.5771222,
        notes: "",
        has_animals: false,
        had_animals: false,
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
    it(`should not add owners`, (done) => {
      let insertions = 0
      owners_set1.forEach((element) => {
        request.post(`/owner`)
          .send(element)
          .set('authorization', tokens['not_logged_in'])
          .end((err, res) => {
            res.should.have.status(200)

            res.body.should.have.property('err')
            res.body.err.should.be.eql('auth')

            if (++insertions === owners_set1.length)
              done()
          })
      })
    })
    it('search for cpf 426.369.178-45', (done) => {
      request.get(`/owner`)
        .query({ cpf: '426.369.178-45' })
        .set('authorization', tokens['not_logged_in'])
        .end((err, res) => {
          res.should.have.status(200)

          res.body.should.have.property('err')
          res.body.err.should.be.eql('auth')

          done()
        })
    })
    it('get all owners', (done) => {
      request.get(`/owner`)
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
    it(`should add owners`, (done) => {
      let insertions = 0
      owners_set1.forEach((element) => {
        request.post(`/owner`)
          .send(element)
          .set('authorization', tokens['admin'])
          .end((err, res) => {
            res.should.have.status(200)

            res.body.should.not.have.property('err')

            if (++insertions === owners_set1.length)
              done()
          })
      })
    })
    it('search for cpf 426.369.178-45', (done) => {
      request.get(`/owner`)
        .query({ cpf: '426.369.178-45' })
        .set('authorization', tokens['admin'])
        .end((err, res) => {
          res.should.have.status(200)

          res.body.should.not.have.property('err')
          res.body.length.should.be.eql(1)

          done()
        })
    })
    it('get all owners', (done) => {
      request.get(`/owner`)
        .query({ text: '' })
        .set('authorization', tokens['admin'])
        .end((err, res) => {
          res.should.have.status(200)

          res.body.should.not.have.property('err')
          res.body.length.should.be.eql(owners_set1.length)

          done()
        })
    })
  })  

  describe(`user role: employee`, () => {
    it(`should add owners`, (done) => {
      let insertions = 0
      owners_set2.forEach((element) => {
        request.post(`/owner`)
          .send(element)
          .set('authorization', tokens['employee'])
          .end((err, res) => {
            res.should.have.status(200)

            res.body.should.not.have.property('err')

            if (++insertions === owners_set2.length)
              done()
          })
      })
    })
    it('search for cpf 351.369.934-51', (done) => {
      request.get(`/owner`)
        .query({ cpf: '351.369.934-51' })
        .set('authorization', tokens['employee'])
        .end((err, res) => {
          res.should.have.status(200)

          res.body.should.not.have.property('err')
          res.body.length.should.be.eql(1)

          done()
        })
    })
    it('get all owners', (done) => {
      request.get(`/owner`)
        .query({ text: '' })
        .set('authorization', tokens['employee'])
        .end((err, res) => {
          res.should.have.status(200)

          res.body.should.not.have.property('err')
          res.body.length.should.be.eql(owners_set1.length + owners_set2.length)

          done()
        })
    })
  })
})
