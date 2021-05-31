import React, { Component } from 'react'
import styles from 'styled-components'
import { Link } from 'react-router-dom'

import { pt as ptLocale } from 'date-fns/locale'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'

import { Button, TextField, MenuItem, FormControlLabel, Checkbox } from '@material-ui/core'
import InputMask from 'react-input-mask'

import { LoadingButton } from '@material-ui/lab'

import Header from '../components/Header'
import Box from '../components/Box'
import StatusBox from '../components/StatusBox'

import { AddOwner } from '../api/OwnerController'
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
`

export default class AddOwnerForm extends Component {
  constructor(props) {
    super(props)

    this.initial_state = {
      // Owner fields
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

      // component-related stuff
      loading: false,
      success: false,
      err: false,
    }
    this.state = { ...this.initial_state }
    this.postalcode_ref = null
  }

  componentDidMount() {
    if (!IsLogged())
      this.props.history.push('/login')
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

    this.setState({ loading: true, err: false, success: false })
    let { err, owner } = await AddOwner({ ...this.state })
    this.setState({ loading: false, err, success: !err })

    if (!err)
      return this.props.history.push(`/owner/${owner}`)
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

  renderForm() {
    return (
      <>
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

        <FormControlLabel
          control={<Checkbox checked={this.state.had_animals} onChange={() => this.setState({ had_animals: !this.state.had_animals })} />}
          label='Teve animais anteriormente?'
        />

        <FormControlLabel
          control={<Checkbox checked={this.state.has_animals} onChange={() => this.setState({ has_animals: !this.state.has_animals })} />}
          label='Possui animais?'
        />

        <TextField label='Notas adicionais' multiline={true} variant='outlined' value={this.state.notes} onChange={(e) => this.setState({ notes: e.target.value })} />

        <LoadingButton disabled={ this.state.loading } onClick={ () => this.submit() } variant='contained' pending={ this.state.loading } pendingPosition='center'>Cadastrar</LoadingButton>
      </>
    )
  }

  renderSuccess() {
    return (
      <Button variant='contained' onClick={() => this.reset() }>Cadastrar Novo Dono</Button>
    )
  }

  render() {
    return (
      <Main>
        <Header/>

        <Box>
          <Menu>
            <span>&#8592; <Link to='/search-owner'>Voltar</Link></span>
            <h3>Adicionar Dono</h3>

            <StatusBox err={this.state.err} success={this.state.success} />

            <div className='fields'>
              { this.state.success ? this.renderSuccess() : this.renderForm() }
            </div>
          </Menu>
        </Box>
      </Main>
    )
  }
}
