import React, { Component } from 'react'
import styles from 'styled-components'
import { Link } from 'react-router-dom'

import { pt as ptLocale } from 'date-fns/locale'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'

import { TextField, MenuItem } from '@material-ui/core'
import InputMask from 'react-input-mask'

import { LoadingButton } from '@material-ui/lab'

import Header from '../components/Header'
import Box from '../components/Box'
import StatusBox from '../components/StatusBox'
import LinkOnClick from '../components/LinkOnClick'

import { GetOwner, UpdateOwner } from '../api/OwnerController'
import GENDERS from '../assets/genders_human.json'
import { IsLogged } from '../api/AccountController'
import { QueryPostalCode } from '../api/PostalCodeController'

const Main = styles.main`
  //background-color: red;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
`

const Menu = styles.div`
  display: flex;
  width: 250px;
  margin: 0 auto;
  flex-direction: column;
  //background: pink;
  place-content: center;

  h3 {
    margin-bottom: 0;
  }

  div.fields {
    display: flex;
    flex-direction: column;
    align-items: center;

    > * {
      margin-top: 0;
      margin-bottom: 20px;
    }

    > *:not(:last-child) {
      width: 90%;
    }

    .MuiInputBase-inputMultiline {
      min-height: 66px;
    }
  }

  table.pets {
    margin-top: 20px;
    border-collapse: collapse;

    tr {
      background: rgba(0, 0, 0, 0.10);
      text-align: left;

      &:nth-child(even) {
        background: rgba(0, 0, 0, 0.03);
      }
    }

    th, td {
      padding: 8px;

      a {
        color: var(--white);
      }
    }
  }

`

export default class Owner extends Component {
  constructor(props) {
    super(props)

    this.initial_state = {
      // Owner fields
      id: '',
      name: '',
      cpf: '',
      email: '',
      gender: '',
      birthdate: null,
      streetname: '',
      number: '',
      postalcode: '',
      state: '',
      city: '',
      notes: '',
      has_animals: false,
      had_animals: false,
      current_pets: [],
      previous_pets: [],

      // component-related stuff
      loading: false,
      success: false,
      err: false,
    }
    this.state = { ...this.initial_state }
    this.postalcode_ref = null
  }

  async componentDidMount() {
    if (!IsLogged())
      return this.props.history.push('/login')

    this.setState({ loading: true })
    let owner_data = await GetOwner(this.props.match.params.id)

    if (owner_data.err === 'not_found')
      return this.props.history.replace('/')

    this.setState({ ...owner_data, loading: false })
  }

  reset() {
    this.setState({ ...this.initial_state })
  }

  async submit() {
    let l = Array.from(document.getElementsByTagName('input'))
    for (let i of l) {
      i.oninput = (e) => e.target.setCustomValidity('')

      // date check
      let aria_invalid = i.getAttribute('aria-invalid')
      if (aria_invalid === 'true') {
        i.setCustomValidity('Data inválida')

        return i.reportValidity()
      }

      if (!i.checkValidity())
        return i.reportValidity()
    }

    let updater = { ...this.state }
    delete updater.current_pets
    delete updater.previous_pets

    this.setState({ loading: true, err: false, success: false })
    let { err } = await UpdateOwner(updater)
    this.setState({ loading: false, err, success: !err && 'Dono atualizado com sucesso' })
  }

  async set_postalcode(pc) {
    this.setState({ postalcode: pc })

    pc = pc.split('').filter((char) => /\d/.test(char)).join('')

    if (pc.length !== 8) return

    let data = await QueryPostalCode(pc)

    if (data.err) {
      this.postalcode_ref.setCustomValidity('CEP não encontrado')
      this.postalcode_ref.oninput = (e) => e.target.setCustomValidity('')
      this.postalcode_ref.reportValidity()
    }

    this.setState(data)
  }

  render() {
    return (
      <Main>
        <Header/>

        <Box>
          <Menu>
            <span>&#8592; <LinkOnClick onClick={() => this.props.history.goBack()}>Voltar</LinkOnClick></span>
            <h3>Perfil do Dono</h3>

            <StatusBox err={this.state.err} success={this.state.success} />

            <div className='fields'>
              <Link to={`/add-pet?owner=${this.state.id}`}>Adicionar PET</Link>

              <TextField label='Nome' variant='outlined' value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} required />

              <InputMask mask='999.999.999-99' value={this.state.cpf} onChange={(e) => this.setState({ cpf: e.target.value })}>
                { (inputProps) => <TextField {...inputProps} label='CPF' variant='outlined' type='text' inputProps={{ pattern: '\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}' }} required /> }
              </InputMask>

              <TextField label='E-mail' type='email' autoComplete='email' variant='outlined' value={this.state.email} onChange={(e) => this.setState({ email: e.target.value.toLowerCase() })} required />

              <TextField select label='Gênero' variant='outlined' value={this.state.gender} onChange={(e) => this.setState({ gender: e.target.value })} required >
                { GENDERS.map((label) => <MenuItem key={label} value={label} style={{ color: 'black', ...this.state.gender === label ? { background: '#9e9e9e', fontWeight: 'bold' } : {} }}>{ label }</MenuItem>) }
              </TextField>

              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptLocale}>
                <KeyboardDatePicker
                  disableToolbar
                  variant='inline'
                  format='dd/MM/yyyy'
                  margin='normal'
                  label='Data de nascimento'
                  disableFuture={true}
                  openTo='year'
                  views={['year', 'month', 'date']}
                  value={this.state.birthdate}
                  onChange={(birthdate) => this.setState({ birthdate }) }
                  KeyboardButtonProps={{ 'aria-label': 'change date' }}
                  required
                />
              </MuiPickersUtilsProvider>

              <InputMask mask='99999-999' value={this.state.postalcode} onChange={(e) => this.set_postalcode(e.target.value)}>
                { (inputProps) => <TextField {...inputProps} inputRef={(x) => this.postalcode_ref = x } label='CEP' variant='outlined' type='text' inputProps={{ pattern: '\\d{5}-\\d{3}' }} required /> }
              </InputMask>

              <TextField label='Logradouro' variant='outlined' value={this.state.streetname} onChange={(e) => this.setState({ streetname: e.target.value })} required />

              <TextField label='Número' variant='outlined' value={this.state.number} onChange={(e) => this.setState({ number: e.target.value })} required />

              <TextField label='Estado' variant='outlined' value={this.state.state} onChange={(e) => this.setState({ state: e.target.value })} required />

              <TextField label='Cidade' variant='outlined' value={this.state.city} onChange={(e) => this.setState({ city: e.target.value })} required />

              <TextField label='Notas adicionais' multiline={true} variant='outlined' value={this.state.notes} onChange={(e) => this.setState({ notes: e.target.value })} />

              <h3>PETs atuais</h3>
              <span hidden={this.state.current_pets.length > 0}>Não foram encontrados PETs atuais</span>
              <table className='pets' hidden={this.state.current_pets.length <= 0}>
                <tbody>
                  <tr><th>Nome</th><th>Sexo</th><th>Raça</th></tr>
                  { this.state.current_pets.map((e) => <tr key={e.id}><td><Link to={`/pet-timeline/${e.id}`}>{e.name}</Link></td><td>{e.gender}</td><td>{e.breed}</td></tr>) }
                </tbody>
              </table>

              <h3>PETs anteriores</h3>
              <span hidden={this.state.previous_pets.length > 0}>Não foram encontrados PETs anteriores</span>
              <table className='pets' hidden={this.state.previous_pets.length <= 0}>
                <tbody>
                  <tr><th>Nome</th><th>Sexo</th><th>Raça</th></tr>
                  { this.state.previous_pets.map((e) => <tr key={e.id}><td><Link to={`/pet-timeline/${e.id}`}>{e.name}</Link></td><td>{e.gender}</td><td>{e.breed}</td></tr>) }
                </tbody>
              </table>

              <LoadingButton disabled={ this.state.loading } onClick={ () => this.submit() } variant='contained' pending={ this.state.loading } pendingPosition='center'>Atualizar</LoadingButton>
            </div>
          </Menu>
        </Box>
      </Main>
    )
  }
}
