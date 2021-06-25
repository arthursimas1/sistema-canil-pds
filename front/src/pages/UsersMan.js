import React, { Component } from 'react'
import styles from 'styled-components'
import { Link } from 'react-router-dom'

import {
  TextField, FormControl, Select, MenuItem, InputLabel,
} from '@material-ui/core'
import Header from '../components/Header'
import Box from '../components/Box'

import StatusBox from '../components/StatusBox'
import { CreateAccount, IsLogged, ListUsers, UpdateUser } from '../api/AccountController'
import CodeToMessage from '../api/CodeToMessage'
import { can } from '../api/authenticate'
import BlockIcon from '@material-ui/icons/Block'
import DoneIcon from '@material-ui/icons/Done'
import EditIcon from '@material-ui/icons/Edit'

const Main = styles.main`
  //background-color: red;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
`

const Menu = styles.div`
  display: flex;
  width: auto;
  margin: 0 auto;
  flex-direction: column;
  //background: pink;
  place-content: center;

  h3 {
    margin-bottom: 0;
  }

  div.fields {
    display: flex;
    flex-direction: row;
    align-items: center;

    > * {
      margin: 0 20px;
      width: 90%;

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }
    }

    .MuiInputBase-inputMultiline {
      min-height: 66px;
    }
  }

  .search-button {
    text-align: right;
    margin-top: 20px;
    margin-right: 20px;
  }

  table.results {
    margin-top: 20px;
    border-collapse: collapse;

    tr {
      background: rgba(0, 0, 0, 0.10);
      text-align: left;

      &:nth-child(even) {
        background: rgba(0, 0, 0, 0.03);
      }

      .MuiSvgIcon-root {
        cursor: pointer;
        fill: var(--background);

        &.edit {
          //display: none;
          opacity: 0;
        }

        &:hover {
          fill: var(--white);
        }
      }

      &:hover .MuiSvgIcon-root.edit {
        //display: block;
        opacity: 1;
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

class Editable extends Component {
  constructor(props) {
    super(props)

    this.initial_state = {
      name: '',
      email: '',
      roles: [],
      ...this.props,
    }
    this.state = {
      ...this.initial_state,

      // component-related stuff
      editing: false,
      loading: false,
      success: false,
      err: false,
    }
    this.ref_email = null
  }

  setEdit() {
    // save state when cancel editing
    this.initial_state = { ...this.state }

    this.setState({ new_user: false, editing: true })
  }

  unsetEdit() {
    // restore state when cancel editing
    this.setState({
      ...this.initial_state,
      editing: false,
    })
  }

  async submit() {
    let data = {
      id: this.props.id,
      name: this.state.name,
      email: this.state.email,
      ...this.props.new_user && { password: '123456' },
      roles: this.state.roles,
      disabled: this.state.roles.length === 0,
    }

    this.setState({ loading: true, err: false, success: false })
    let { err } = await (this.props.new_user ? CreateAccount : UpdateUser)(data)
    if (err) {
      if (err === 'duplicate_email') {
        this.ref_email.oninput = (e) => e.target.setCustomValidity('')
        this.ref_email.setCustomValidity(CodeToMessage(err))
        this.ref_email.reportValidity()
      }

      this.setState({ loading: false, err: true, success: false })
    } else {
      this.initial_state.name = this.state.name
      this.initial_state.email = this.state.email
      this.initial_state.roles = [ ...this.state.roles ]

      this.setState({ new_user: false, loading: false, err: false, success: true, editing: false })
    }
  }

  renderData() {
    return <tr><td>{this.state.name}</td><td>{this.state.email}</td><td>{this.state.roles.join(', ')}</td><td><EditIcon className='edit' onClick={() => this.setEdit()} /></td></tr>
  }

  renderEditing() {
    return (
      <tr>
        <td>
          <TextField value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} required />
        </td>
        <td>
          <TextField inputRef={(x) => this.ref_email = x} value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} required />
        </td>
        <td>
          <FormControl variant='outlined' style={{ width: '200px' }}>
            <InputLabel id='roles-label'>Permissões</InputLabel>
            <Select
              labelId='roles-label'
              label='Permissões'
              multiple
              disabled={this.props.me}
              value={this.state.roles}
              onChange={(e) => {
                const c = new Intl.Collator()
                e.target.value.sort(c.compare)
                this.setState({ roles: e.target.value })
              }}
              required>
              { ['admin', 'employee'].map((i) => <MenuItem key={i} value={i} style={{ color: 'black', ...this.state.roles.indexOf(i) !== -1 ? { background: '#9e9e9e', fontWeight: 'bold' } : {} }}>{i}</MenuItem>) }
            </Select>
          </FormControl>
        </td>
        <td>
          <BlockIcon onClick={() => this.unsetEdit()} />
          <DoneIcon onClick={() => this.submit()} />
        </td>
      </tr>
    )
  }

  render() {
    if (this.props.new_user && this.state.new_user)
      return <tr><td /><td /><td style={{ textDecoration: 'underline' }} onClick={() => this.setEdit()}>Adicionar usuário</td><td /></tr>

    return (
      <>
        { this.state.editing ? this.renderEditing() : this.renderData() }
        { this.props.new_user && !this.state.new_user && <Editable new_user={true} /> }
      </>
    )
  }
}

export default class UsersMan extends Component {
  constructor(props) {
    super(props)

    this.initial_state = {
      // component-related stuff
      results: [],
      loading: false,
      success: false,
      err: false,
    }
    this.state = { ...this.initial_state }
  }

  async componentDidMount() {
    if (!IsLogged() || !can().readAny('user').granted)
      return this.props.history.push('/login')

    await this.search()
  }

  reset() {
    this.setState({ ...this.initial_state })
  }

  async search() {
    this.setState({ loading: true, err: false, success: false })
    let { err, users: results } = await ListUsers()

    if (results)
      this.setState({ results })

    this.setState({ loading: false, err, success: !err })
  }

  render() {
    return (
      <Main>
        <Header/>

        <Box>
          <Menu>
            <span>&#8592; <Link to='/'>Voltar</Link></span>
            <h3>Usuários</h3>

            <table className='results'>
              <tbody>
                <tr><th>Nome</th><th>E-mail</th><th>Permissões</th><th /></tr>
                { this.state.results.map((e) => <Editable key={e.id} {...e} />) }
                { <Editable new_user={true} /> }
              </tbody>
            </table>
            <StatusBox err='Por padrão, a senha de um usuário novo é 123456' />
          </Menu>
        </Box>
      </Main>
    )
  }
}
