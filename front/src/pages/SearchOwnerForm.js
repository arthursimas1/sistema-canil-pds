import React, { Component } from 'react'
import styles from 'styled-components'
import { Link } from 'react-router-dom'

import { TextField } from '@material-ui/core'
import { LoadingButton } from '@material-ui/lab'
import Header from '../components/Header'
import Box from '../components/Box'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import SearchIcon from '@material-ui/icons/Search'

import { SearchOwner } from '../api/OwnerController'
import StatusBox from '../components/StatusBox'
import { IsLogged } from '../api/AccountController'
import InputMask from 'react-input-mask'

const Main = styles.main`
  //background-color: red;
  min-height: 100%;
  //background-image: linear-gradient(45deg, #039be5 30%, #81d4fa 90%);
  //min-height: 100vh;
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

  div.buttons {
    display: flex;
    flex-direction: row;
    //justify-content: space-between;
    justify-content: center;
    margin-top: 20px;
    //margin-right: 20px;

    > *:not(:last-child) {
      margin-right: 20px;
    }
  }

  .confirm-button {
    background-color: #32CD32;
    &:hover {
      background-color: #228B22;
    }
  }

  .search-button {
    //display: flex;
    //flex-direction: column;
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
    }

    th, td {
      padding: 8px;
      border: 1px solid rgba(0, 0, 0, 0.4);

      a {
        color: var(--white);
      }
    }
  }
`

export default class SearchOwnerForm extends Component {
  constructor(props) {
    super(props)

    this.initial_state = {
      // Owner search fields
      cpf: '',

      // component-related stuff
      results: [],
      loading: false,
      success: false,
      err: false,
    }
    this.state = { ...this.initial_state }
  }

  async componentDidMount() {
    if (!IsLogged())
      return this.props.history.push('/login')

    await this.search()
  }

  reset() {
    this.setState({ ...this.initial_state })
  }

  async search() {
    this.setState({ loading: true, err: false, success: false })
    let query = this.state.cpf.length > 0 ? { cpf: this.state.cpf } : {}
    let results = await SearchOwner(query)
    const err = results.length ? false : 'Nenhum resultado encontrado'
    this.setState({ loading: false, results, err, success: !err })
  }

  render() {
    return (
      <Main>
        <Header/>

        <Box>
          <Menu>
            <span>&#8592; <Link to='/' style={{ color: 'var(--white)' }}>Voltar</Link></span>
            <h3>Buscar Dono</h3>

            <div className='fields'>
              <InputMask style={{ flex: 1 }} mask='999.999.999-99' value={ this.state.cpf } onChange={ (e) => this.setState({ cpf: e.target.value }) }>
                { (inputProps) => <TextField {...inputProps} label='CPF' variant='outlined' type='text' inputProps={{ pattern: '\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}' }} required /> }
              </InputMask>
            </div>

            <div className='buttons'>
              <Button className='confirm-button' component={Link} to='/add-owner' variant='contained' startIcon={<AddIcon/>}>Adicionar</Button>

              <LoadingButton disabled={ this.state.loading } onClick={ () => this.search() } variant='contained' pending={ this.state.loading } pendingPosition='center' startIcon={<SearchIcon/>}>Buscar</LoadingButton>
            </div>

            <StatusBox err={this.state.err} />
          </Menu>
        </Box>

        <Box hidden={this.state.results.length <= 0}>
          <Menu>
            <table className='results'>
              <tbody>
                <tr><th>Nome</th><th>CPF</th><th>E-mail</th><th>Gênero</th><th>Rua</th><th>CEP</th><th>Estado</th><th>Cidade</th></tr>
                { this.state.results.map((e) => <tr key={e.id}><td><Link to={`/owner/${e.id}`}>{e.name}</Link></td><td>{e.cpf}</td><td>{e.email}</td><td>{e.gender}</td><td>{e.streetname}</td><td>{e.postalcode}</td><td>{e.state}</td><td>{e.city}</td></tr>) }
              </tbody>
            </table>
          </Menu>
        </Box>
      </Main>
    )
  }
}
