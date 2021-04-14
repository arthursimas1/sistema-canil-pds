import React, { Component } from 'react'
import styles from 'styled-components'
import { Link } from 'react-router-dom'

import { TextField, MenuItem } from '@material-ui/core'
import { LoadingButton } from '@material-ui/lab'
import Header from '../components/Header'
import Box from '../components/Box'

import { SearchOwner } from '../api/OwnerController'
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
    }

    th, td {
      padding: 8px;

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
      name: '',
      cpf: '',
      email: '',
      gender: '',
      streetname: '',
      number: '',
      postalcode: '',
      state: '',
      city: '',

      // component-related stuff
      results: [],
      loading: false,
      success: false,
      err: false,
    }
    this.state = { ...this.initial_state }
  }

  reset() {
    this.setState({ ...this.initial_state })
  }

  async search() {
    this.setState({ loading: true, err: false, success: false })
    const { name, cpf, email, gender, streetname, number, postalcode, state, city } = this.state
    let results = await SearchOwner({ name, cpf, email, gender, streetname, number, postalcode, state, city })
    this.setState({ loading: false, results, err: false, success: true })
  }

  render() {
    return (
      <Main>
        <Header/>

        <Box>
          <Menu>
            <span>&#8592; <Link to='/'>Voltar</Link></span>
            <h3>Buscar Dono</h3>
            <br />

            <div className='fields'>

              <TextField label='Nome' variant='outlined' value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} required />

              <TextField label='CPF' variant='outlined' value={this.state.cpf} onChange={(e) => this.setState({ cpf: e.target.value })} required />

              <TextField label='E-Mail' variant='outlined' value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} required />

              <TextField select label='Sexo' variant='outlined' value={this.state.gender} onChange={(e) => this.setState({ gender: e.target.value })} required >
                <MenuItem key='' value='' style={{ color: 'black' }}>Não Selecionado</MenuItem>
                { GENDERS.map((label) => <MenuItem key={label} value={label} style={{ color: 'black', ...this.state.gender === label ? { background: '#9e9e9e', fontWeight: 'bold' } : {} }}>{ label }</MenuItem>) }
              </TextField>

              <TextField label='Rua' variant='outlined' value={this.state.streetname} onChange={(e) => this.setState({ streetname: e.target.value })} required />

              <TextField label='CEP' variant='outlined' value={this.state.postalcode} onChange={(e) => this.setState({ postalcode: e.target.value })} required />

              <TextField label='Estado' variant='outlined' value={this.state.state} onChange={(e) => this.setState({ state: e.target.value })} required />

              <TextField label='Cidade' variant='outlined' value={this.state.city} onChange={(e) => this.setState({ city: e.target.value })} required />
            </div>

            <div className='search-button'>
              <LoadingButton disabled={ this.state.loading } onClick={ () => this.search() } variant='contained' pending={ this.state.loading } pendingPosition='center'>Buscar</LoadingButton>
            </div>

            <table className='results' hidden={this.state.results.length <= 0}>
              <tbody>
                <tr><th>Nome</th><th>CPF</th><th>E-Mail</th><th>Sexo</th><th>Rua</th><th>CEP</th><th>Estado</th><th>Cidade</th></tr>
                { this.state.results.map((e) => <tr key={e.id}><td><Link to={`/pet-timeline/${e.id}`}>{e.name}</Link></td><td>{e.cpf}</td><td>{e.email}</td><td>{e.gender}</td><td>{e.streetname}</td><td>{e.postalcode}</td><td>{e.state}</td><td>{e.city}</td></tr>) }
              </tbody>
            </table>
          </Menu>
        </Box>
      </Main>
    )
  }
}
