import React, { Component } from 'react'
import styles from 'styled-components'

import Header from '../components/Header'
import Box from '../components/Box'

import { TextField, FormControlLabel, Checkbox } from '@material-ui/core'
import { LoadingButton } from '@material-ui/lab'

import { IsLogged, GetAccountInfo, UpdateAccount } from '../api/AccountController'

import StatusBox from '../components/StatusBox'
import CodeToMessage from '../api/CodeToMessage'
import { Link } from 'react-router-dom'

const Main = styles.main`
  //background-color: red;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
`

const StyledContactForm = styles.div`
  //width: fit-content;
  //width: 420px;
  //color: var(--white);
  //margin: 120px auto 60px;
  //padding: 20px;
  //padding-top: 0;
  //background: var(--secondary);
  //border: 3px solid white;

  a {
    color: white;
    text-decoration: underline;
  }

  @media (max-width: 650px) {
    width: 85vw;
  }

  h1 {
    text-align: center;
  }

  div.fields {
    display: flex;
    flex-direction: column;
    align-items: center;

    > * {
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

export default class MyAccount extends Component {
  constructor(props) {
    super(props)

    this.initial_state = {
      name: '',
      email: '',
      editable_name: true,
      change_password: false,
      new_password: '',
      new_password2: '',

      loading: false,
      err: false,
      success: false,
    }
    this.state = { ...this.initial_state }
  }

  async componentDidMount() {
    if (!IsLogged())
      return this.props.history.push('/')

    let data = await GetAccountInfo()

    if (!data.err)
      this.setState(data)

    this.setState({ loading: false, err: data.err, success: false })
  }

  async submit() {
    let l = Array.from(document.getElementsByTagName('input'))
    for (let i of l) i.oninput = (e) => e.target.setCustomValidity('')

    for (let i = 0; i < 2; i++) {
      if (!l[i].checkValidity()) {
        l[i].reportValidity()

        return
      }
    }

    if (this.state.change_password) {
      if (this.state.new_password.length < 5) {
        l[3].setCustomValidity(CodeToMessage('password_too_short'))
        l[3].reportValidity()

        return
      } else if (this.state.new_password !== this.state.new_password2) {
        l[4].setCustomValidity(CodeToMessage('wrong_password_confirmation'))
        l[4].reportValidity()

        return
      }
    }

    this.setState({ loading: true, err: false, success: false })
    let { err } = await UpdateAccount(this.state)
    this.setState({ loading: false, err, success: !err && 'Informações atualizadas' })
  }

  reset() {
    this.setState({ ...this.initial_state })
  }

  render() {
    return (
      <Main>
        <Header />

        <Box>
          <StyledContactForm>
            <span>&#8592; <Link to='/'>Voltar</Link></span>
            <h1>Minha Conta</h1>
            <StatusBox err={this.state.err} success={this.state.success} />
            <div className='fields'>
              <TextField label='Nome' variant='outlined' autoComplete='name' value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} required/>
              <TextField label='E-mail' type='email' autoComplete='username' variant='outlined' value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} required />
              <FormControlLabel
                control={<Checkbox checked={this.state.change_password} onChange={() => this.setState({ change_password: !this.state.change_password, new_password: '', new_password2: '' })} />}
                label="Alterar senha"
              />
              <TextField label='Senha' type='password' autoComplete='new-password' hidden={!this.state.change_password} variant='outlined' value={this.state.new_password} onChange={(e) => this.setState({ new_password: e.target.value })} required />
              <TextField label='Confirmar' type='password' autoComplete='new-password' hidden={!this.state.change_password} variant='outlined' value={this.state.new_password2} onChange={(e) => this.setState({ new_password2: e.target.value })} required />
              <LoadingButton id='button' disabled={ this.state.loading } onClick={ () => this.submit() } variant='contained' pending={this.state.loading} pendingPosition='center'>Alterar dados</LoadingButton>
            </div>
          </StyledContactForm>
        </Box>
      </Main>
    )
  }
}
