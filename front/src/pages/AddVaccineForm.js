import React, { Component } from 'react'
import styles from 'styled-components'
import { Link } from 'react-router-dom'

import { Button, TextField } from '@material-ui/core'

import { LoadingButton } from '@material-ui/lab'

import Header from '../components/Header'
import Box from '../components/Box'
import StatusBox from '../components/StatusBox'

import { AddVaccine } from '../api/VaccineController'
import { IsLogged } from '../api/AccountController'
import { can } from '../api/authenticate'

const Main = styles.main`
  //background-color: red;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
`

const Menu = styles.div`
  display: flex;
  width: 1000px;
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

  div.text {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: left;

    > *:not(:last-child) {
      margin-right: 20px;
    }
    > *:last-child {
      flex: 1;
    }
  }
`

export default class AddVaccineForm extends Component {
  constructor(props) {
    super(props)

    this.initial_state = {
      // Vaccine fields
      name: '',
      manufacturer: '',
      description: '',

      // component-related stuff
      loading: false,
      success: false,
      err: false,
    }
    this.state = { ...this.initial_state }
  }

  componentDidMount() {
    if (!IsLogged() || !can().createAny('vaccine').granted)
      this.props.history.push('/login')
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
    let { err } = await AddVaccine({ ...this.state })
    this.setState({ loading: false, err, success: !err && 'Vacina cadastrada com sucesso' })
  }

  renderForm() {
    return (
      <>
        <div className='text'>
          <TextField style={{ width: '600px' }} label='Nome' variant='outlined' value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} required />

          <TextField label='Fabricante' variant='outlined' value={this.state.manufacturer} onChange={(e) => this.setState({ manufacturer: e.target.value })} required />
        </div>

        <TextField label='Descrição' multiline={true} variant='outlined' value={this.state.description} onChange={(e) => this.setState({ description: e.target.value })} required />

        <LoadingButton disabled={ this.state.loading } onClick={ () => this.submit() } variant='contained' pending={ this.state.loading } pendingPosition='center'>Cadastrar</LoadingButton>
      </>
    )
  }

  renderSuccess() {
    return (
      <Button variant='contained' onClick={() => this.reset() }>Cadastrar Nova Vacina</Button>
    )
  }

  render() {
    return (
      <Main>
        <Header/>

        <Box>
          <Menu>
            <span>&#8592; <Link to='/edit-vaccines' style={{ color: 'var(--white)' }}>Voltar</Link></span>
            <h3>Adicionar Vacina</h3>

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
