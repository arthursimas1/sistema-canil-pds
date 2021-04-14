import React, { Component } from 'react'
import styles from 'styled-components'
import { Link } from 'react-router-dom'

import { pt as ptLocale } from 'date-fns/locale'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'

import { Button, TextField, MenuItem } from '@material-ui/core'

import { LoadingButton } from '@material-ui/lab'

import Header from '../components/Header'
import Box from '../components/Box'
import StatusBox from '../components/StatusBox'

import { AddOwner } from '../api/OwnerController'
import GENDERS from '../assets/genders.json'

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

      // component-related stuff
      loading: false,
      success: false,
      err: false,
    }
    this.state = { ...this.initial_state }
  }

  reset() {
    this.setState({ ...this.initial_state })
  }

  async submit() {
    let l = Array.from(document.getElementsByTagName('input'))
    for (let i of l) {
      i.oninput = (e) => e.target.setCustomValidity('')

      if (!i.checkValidity())
        return i.reportValidity()
    }

    this.setState({ loading: true, err: false, success: false })
    let { err } = await AddOwner({ ...this.state })
    this.setState({ loading: false, err, success: !err && 'Dono cadastrado com sucesso' })
  }

  renderForm() {
    return (
      <>
        <TextField label='Nome' variant='outlined' value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} required />

        <TextField label='CPF' variant='outlined' value={this.state.cpf} onChange={(e) => this.setState({ cpf: e.target.value })} required />

        <TextField label='E-Mail' variant='outlined' value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} required />

        <TextField select label='Sexo' variant='outlined' value={this.state.gender} onChange={(e) => this.setState({ gender: e.target.value })} required >
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

        <TextField label='Rua' variant='outlined' value={this.state.streetname} onChange={(e) => this.setState({ streetname: e.target.value })} required />

        <TextField label='CEP' variant='outlined' value={this.state.postalcode} onChange={(e) => this.setState({ postalcode: e.target.value })} required />

        <TextField label='Estado' variant='outlined' value={this.state.state} onChange={(e) => this.setState({ state: e.target.value })} required />

        <TextField label='Cidade' variant='outlined' value={this.state.city} onChange={(e) => this.setState({ city: e.target.value })} required />

        <TextField label='Notas adicionais' variant='outlined' value={this.state.notes} onChange={(e) => this.setState({ notes: e.target.value })} required />

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
            <span>&#8592; <Link to='/'>Voltar</Link></span>
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