import React, { Component } from 'react'
import styles from 'styled-components'
import { Link } from 'react-router-dom'

import { TextField, MenuItem } from '@material-ui/core'
import { LoadingButton } from '@material-ui/lab'
import Header from '../components/Header'
import Box from '../components/Box'

import { SearchPet } from '../api/PetController'
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

export default class SearchPetForm extends Component {
  constructor(props) {
    super(props)

    this.initial_state = {
      // PET search fields
      name: '',
      species: '',
      breed: '',
      gender: '',

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
    const { name, species, breed, gender } = this.state
    let results = await SearchPet({ name, species, breed, gender })
    this.setState({ loading: false, results, err: false, success: true })
  }

  render() {
    return (
      <Main>
        <Header/>

        <Box>
          <Menu>
            <span>&#8592; <Link to='/'>Voltar</Link></span>
            <h3>Buscar PET</h3>
            <br />

            <div className='fields'>

              <TextField label='Nome' variant='outlined' value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} />

              <TextField select label='Sexo' variant='outlined' value={this.state.gender} onChange={(e) => this.setState({ gender: e.target.value })} >
                <MenuItem key='' value='' style={{ color: 'black' }}>Não Selecionado</MenuItem>
                { GENDERS.map((label) => <MenuItem key={label} value={label} style={{ color: 'black', ...this.state.gender === label ? { background: '#9e9e9e', fontWeight: 'bold' } : {} }}>{ label }</MenuItem>) }
              </TextField>

              <TextField select label='Espécie' variant='outlined' value={this.state.species} onChange={(e) => this.setState({ species: e.target.value, breed: '' })} >
                <MenuItem key='' value='' style={{ color: 'black' }}>Não Selecionado</MenuItem>
                { Object.keys(BREEDS).map((label) => <MenuItem key={label} value={label} style={{ color: 'black', ...this.state.species === label ? { background: '#9e9e9e', fontWeight: 'bold' } : {} }}>{ label }</MenuItem>) }
              </TextField>

              <TextField select label='Raça' variant='outlined' disabled={this.state.species === ''} value={this.state.breed} onChange={(e) => this.setState({ breed: e.target.value })} >
                <MenuItem key='' value='' style={{ color: 'black' }}>Não Selecionado</MenuItem>
                { this.state.species !== '' && BREEDS[this.state.species].map((label) => <MenuItem key={label} value={label} style={{ color: 'black', ...this.state.breed === label ? { background: '#9e9e9e', fontWeight: 'bold' } : {} }}>{ label }</MenuItem>) }
              </TextField>
            </div>

            <div className='search-button'>
              <LoadingButton disabled={ this.state.loading } onClick={ () => this.search() } variant='contained' pending={ this.state.loading } pendingPosition='center'>Buscar</LoadingButton>
            </div>

            <table className='results' hidden={this.state.results.length <= 0}>
              <tbody>
                <tr><th>Nome</th><th>Dono</th><th>Sexo</th><th>Espécie</th><th>Raça</th></tr>
                { this.state.results.map((e) => <tr key={e.id}><td><Link to={`/pet-timeline/${e.id}`}>{e.name}</Link></td><td>{e.owner.name}</td><td>{e.gender}</td><td>{e.species}</td><td>{e.breed}</td></tr>) }
              </tbody>
            </table>
          </Menu>
        </Box>
      </Main>
    )
  }
}
