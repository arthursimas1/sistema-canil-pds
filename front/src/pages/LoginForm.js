import React, { Component } from 'react'
import styles from 'styled-components'
import { TextField } from '@material-ui/core'
import { LoadingButton } from '@material-ui/lab'
import { Link } from 'react-router-dom'
import { IsLogged, Login } from '../api/AccountController'

import StatusBox from '../components/StatusBox'
import Header from '../components/Header'

const Main = styles.main` 
    //background-color: var(--primary);
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`

const StyledLoginForm = styles.div`
  color: var(--white);
  background: var(--lightgray);
  //width: fit-content;
  //width: 420px;
  //color: var(--white);
  margin: 120px auto 60px;
  padding: 20px;
  padding-top: 0;
  //background: var(--secondary);
  border: 3px solid white;

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

export default class LoginForm extends Component {
  constructor(props) {
    super(props)

    this.initial_state = {
      email: '',
      password: '',

      loading: false,
      success: false,
      err: false,
    }
    this.state = { ...this.initial_state }
  }

  componentDidMount() {
    if (IsLogged())
      this.props.history.push('/')
  }

  async submit() {
    let l = document.getElementsByTagName('input')
    for (let e of l) {
      if (!e.checkValidity()) {
        e.reportValidity()

        return { err: true }
      }
    }

    this.setState({ loading: true, err: false, success: false })
    let { err } = await Login({ ...this.state })
    if (!err)
      this.props.history.push('/')
    else
      this.setState({ loading: false, err, success: !err })
  }

  render() {
    return (
      <Main>
        <Header />
        <StyledLoginForm>
          <h1>Login</h1>
          <StatusBox err={this.state.err} success={this.state.success} />
          <div className='fields'>
            <TextField label='E-mail' type='email' autoComplete='username' variant='outlined' error={this.state.err === 'wrong_credentials'} value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} required />
            <TextField label='Senha' type='password' autoComplete='current-password' variant='outlined' error={this.state.err === 'wrong_credentials'} value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} required />
            <LoadingButton disabled={ this.state.loading } onClick={ () => this.submit() } variant='contained' pending={this.state.loading} pendingPosition='center'>Entrar</LoadingButton>
          </div>
        </StyledLoginForm>
      </Main>
    )
  }
}
