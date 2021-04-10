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

import { AddPet } from '../api/PetController'
import BREEDS from '../assets/breeds.json'
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

export default class AddPetForm extends Component {
  constructor(props) {
    super(props)

    this.initial_state = {
      // PET fields
      name: '',
      species: '',
      breed: '',
      birthdate: null,
      gender: '',
      owner: null, // not implemented

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
    let { err } = await AddPet({ ...this.state })
    this.setState({ loading: false, err, success: !err && 'PET cadastrado com sucesso' })
  }

  renderForm() {
    return (
      <>
        <TextField label='Nome' variant='outlined' value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} required />

        <TextField select label='Sexo' variant='outlined' value={this.state.gender} onChange={(e) => this.setState({ gender: e.target.value })} required >
          { GENDERS.map((label) => <MenuItem key={label} value={label} style={{ color: 'black', ...this.state.gender === label ? { background: '#9e9e9e', fontWeight: 'bold' } : {} }}>{ label }</MenuItem>) }
        </TextField>

        <TextField select label='Espécie' variant='outlined' value={this.state.species} onChange={(e) => this.setState({ species: e.target.value, breed: '' })} required >
          { Object.keys(BREEDS).map((label) => <MenuItem key={label} value={label} style={{ color: 'black', ...this.state.species === label ? { background: '#9e9e9e', fontWeight: 'bold' } : {} }}>{ label }</MenuItem>) }
        </TextField>

        <TextField select label='Raça' variant='outlined' disabled={this.state.species === ''} value={this.state.breed} onChange={(e) => this.setState({ breed: e.target.value })} required >
          { this.state.species !== '' && BREEDS[this.state.species].map((label) => <MenuItem key={label} value={label} style={{ color: 'black', ...this.state.breed === label ? { background: '#9e9e9e', fontWeight: 'bold' } : {} }}>{ label }</MenuItem>) }
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

        <LoadingButton disabled={ this.state.loading } onClick={ () => this.submit() } variant='contained' pending={ this.state.loading } pendingPosition='center'>Cadastrar</LoadingButton>
      </>
    )
  }

  renderSuccess() {
    return (
      <Button variant='contained' onClick={() => this.reset() }>Cadastrar Novo PET</Button>
    )
  }

  render() {
    return (
      <Main>
        <Header/>

        <Box>
          <Menu>
            <span>&#8592; <Link to='/'>Voltar</Link></span>
            <h3>Adicionar PET</h3>

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