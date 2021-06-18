/*eslint-env node, mocha */

import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../src/index.mjs'
import { Init as mailerInit } from '../src/helper/mailer.mjs'
import nodemailerMock from 'nodemailer-mock'
//import * as testingTools from './testingTools.mjs'

chai.use(chaiHttp)
let request = chai.request(app).keepOpen()

describe('Email', () => {
  let owners, pet, data, tokens = { not_logged_in: '' }
  before((done) => {
    owners = [
    {
      name: "Arthur Simas",
      cpf: "426.369.178-45",
      //email: "arthursimas1@gmail.com",
      email: "kaiohys@hotmail.com",
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
      has_animals: true,
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

    pet = {
      name: "Forrest Gump",
      breed: "Sem raça definida (SRD)",
      birthdate: "2019-01-08T11:11:00.000Z",
      gender: "Macho",
      owner: "",
    }
  
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
      
    owners.forEach((element) => {
      request.post(`/owner`)
        .send(element)
        .set('authorization', tokens['admin'])
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.not.have.property('err')

          done()
        })
      })
    const previous_owner = request.get(`/owner`)
      .query({ cpf: '126.255.668-40' })
      .set('authorization', tokens['admin'])
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.not.have.property('err')

        done()
      })
    pet.owner = previous_owner.id
    const new_owner = request.get(`/owner`)
      .query({ cpf: '426.369.178-45' })
      .set('authorization', tokens['admin'])
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.not.have.property('err')

        done()
      })
    request.post(`/pet`)
      .send(pet)
      .set('authorization', tokens['admin'])
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.not.have.property('err')

        done()
      })

    pet = request.get(`/pet`)
      .query({ name: 'Forrest Gump' })
      .set('authorization', tokens['admin'])
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.not.have.property('err')

        done()
      })

    data = {
      event: 'ownership_transfer',
      pet: pet,
      description: '',
      metadata: { type: 'ownership_transfer', previous_owner: previous_owner.id, new_owner: new_owner.id },
    }
  });
  before(async () => {
    await mailerInit(nodemailerMock)
  });
  afterEach(() => {
    nodemailerMock.mock.reset()
    nodemailerMock.mock.setMockedVerify(false)
  });

  ['not_logged_in', 'admin', 'employee'].forEach((label) => {
    describe(`user role: ${label}`, () => {
      it(`send email when transfering pet`, (done) => {
        request.post(`/pet/:pet/timeline`)
          .send(data)
          .set('authorization', tokens[label])
          .end((err, res) => {
            res.should.have.status(200)            

            if (label === 'not_logged_in') {
              res.body.should.have.property('err')
              res.body.err.should.be.eql('not_allowed')
            } else {
              const sent_mail = nodemailerMock.mock.getSentMail()
              sent_mail.length.should.equal(1)
              sent_mail[0].context.name === 'Arthur Simas'
            }

            done()
          })
      })
    })
  })
})
